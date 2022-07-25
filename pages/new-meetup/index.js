import { useRouter } from "next/router";
import Head from "next/head";

import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { Fragment } from "react";

function NewMeetupPage() {
  const router = useRouter();
  async function addMeetupHandler(enteredData) {
    //8.api경로로 request보내기
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //9.fetch로부터 응답얻기
    const data = await response.json();

    console.log(data);

    //12. 다른페이지로 이동(뒤로가기 가능)
    router.push("/");
  }

  return (
    <Fragment>
      <Head>
        <title>Add a new meetup</title>
        <meta name="description" content="Add your own meetups" />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
}
export default NewMeetupPage;
