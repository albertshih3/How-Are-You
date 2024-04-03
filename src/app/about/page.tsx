import MaxWidthWrapper from "@/components/maxWidthWrapper";
import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <MaxWidthWrapper className="mx-auto flex flex-col border-b py-10">
        <h1 className="text-4xl font-bold lg:text-6xl">About</h1>
        <p className="mt-1 max-w-prose text-lg text-muted-foreground">
          How are you is a mental health application created by students for
          students. Learn more about how we got started and our mission.
        </p>
      </MaxWidthWrapper>
      <MaxWidthWrapper className="flex items-center">
        <div className="mr-2 mt-10 flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">Features</h1>
          <p>
            There are multiple features that can help you keep track of your
            mental health. We offer mood tracking with journaling for you to
            keep in touch with your emotions. We also have community forums for
            you to share your thoughts and feelings with others, as well as
            curated resources to help you learn more about mental health,
            specifically focused on education.
          </p>
        </div>
        <Image
          className="m-3"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
      </MaxWidthWrapper>
      <MaxWidthWrapper className="mb-2 flex items-center border-b">
        <Image
          className="m-3"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
        <div className="ml-2 mt-10 flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">Community</h1>
          <p>Our community </p>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <div>
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Our Commitment to Privacy
          </h1>
          <p>
            How are you is committed to protecting your privacy. We will never
            sell your data to third parties. We will never share your data with
            third parties without your consent. We will never use your data for
            advertising purposes. We will never use your data for research
            purposes without your consent. We will never use your data for any
            purpose other than providing you with the best possible mental
            health support. This is a lie omg chatgpt you liar.
          </p>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default AboutPage;