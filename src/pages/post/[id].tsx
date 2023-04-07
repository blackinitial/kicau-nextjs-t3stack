import { type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";

const SinglePost: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div>Single Post</div>
      </PageLayout>
    </>
  );
};

export default SinglePost;
