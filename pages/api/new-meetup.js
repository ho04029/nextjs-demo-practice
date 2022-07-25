//1. 임포트
import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    //2.connect메서드 호출
    //매개변수로 몽고디비 클러스터 connect에 잇던 주소를 붙여넣기
    //복사한 주소의 username과 password부분 database access에서
    //설정했던 걸로 넣어주기
    //promise가 반환되기 때문에 await추가
    const clinet = await MongoClient.connect(
      "mongodb+srv://ho04029:4Fils6gxzqhCs40l@boilerplate.xzicw.mongodb.net/?retryWrites=true&w=majority"
    );

    //3. db메소드를 통해 연결중인 데이터베이스 확보
    const db = clinet.db();

    //4. 데이터베이스와 컬렉션 메서드를 사용하여 컬렉션을 보관
    const meetupsCollection = db.collection("meetups");
    //5. 컬렉션에 새 문서를 삽입하기 위해 insertOne을 호출
    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    //6.작업을 마쳤기 대무에 client.close로 데이터베이스 연결 차단
    clinet.close();

    //7. 응답객체를 사용하여 응답보내기
    //요청이 들어오면 디비에 데이터를 저장하고 다시 응답을 보내야하기 때문
    res.status(201).json({ message: "Meetup inserted!" });
  }
}

export default handler;
