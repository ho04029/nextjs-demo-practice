import Head from "next/head";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetup"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

export async function getStaticProps() {
  const clinet = await MongoClient.connect(
    "mongodb+srv://ho04029:4Fils6gxzqhCs40l@boilerplate.xzicw.mongodb.net/?retryWrites=true&w=majority"
  );

  const db = clinet.db();

  const meetupsCollection = db.collection("meetups");

  //find메서드 호출
  const meetups = await meetupsCollection.find().toArray();

  clinet.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
