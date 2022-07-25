import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";

//9. 프롭스 설정해주기
function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        img={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  //2. new-meetup작업할 때 사용했던 것을 붙여넣기
  const clinet = await MongoClient.connect(
    "mongodb+srv://ho04029:4Fils6gxzqhCs40l@boilerplate.xzicw.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = clinet.db();

  const meetupsCollection = db.collection("meetups");

  //3. find호출
  //첫번째 인자로 특정 필드값을 입력하여 필터 기준을 정의할 수 있음
  //두번째 인자에는 찾아진 모든 문서에서 추출되어야할 필드를 정의
  //여기서는 id에만 관심이 있으므로 _id입력
  //1은 _id만 포함하고 다른 필드값은 포함하지 않는다는 의미
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  //5. 닫아주기
  clinet.close();
  //4. 리턴값 매핑
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  //6.동적으로 사용하기위해 이쪽에도 몽고디비 사용
  const clinet = await MongoClient.connect(
    "mongodb+srv://ho04029:4Fils6gxzqhCs40l@boilerplate.xzicw.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = clinet.db();

  const meetupsCollection = db.collection("meetups");

  //7.findOne메소드 사용
  //findOne에 어떻게 필터링하고 어떻게 문서를 검색하는지
  //정의하는 객체를 전달해야함
  //여기서는 _id가 meetupId와 같은 것을 찾음
  //find와 마찬가지로 프로미스를 반환하므로 await붙여줌
  //11.meetupId를 ObjectId로 감싸줌
  //이렇게 하면 String인 meetupId를 Object로 변환시켜주시때문에
  //_id와 비교가 가능해짐
  const selectMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  clinet.close();

  //8. 리턴값 변경
  return {
    props: {
      meetupData: {
        id: selectMeetup._id.toString(),
        title: selectMeetup.title,
        address: selectMeetup.address,
        image: selectMeetup.image,
        description: selectMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
