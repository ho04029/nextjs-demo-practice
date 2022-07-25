import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";

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
  const clinet = await MongoClient.connect(
    "mongodb+srv://ho04029:4Fils6gxzqhCs40l@boilerplate.xzicw.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = clinet.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  clinet.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const clinet = await MongoClient.connect(
    "mongodb+srv://ho04029:4Fils6gxzqhCs40l@boilerplate.xzicw.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = clinet.db();

  const meetupsCollection = db.collection("meetups");

  const selectMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  clinet.close();

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
