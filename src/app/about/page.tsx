import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <MaxWidthWrapper className="mx-auto flex flex-col py-10">
        <h1 className="text-4xl font-bold lg:text-6xl">About</h1>
        <p className="mt-1 max-w-prose lg:text-lg text-muted-foreground">
          How are you is a mental health application created by students for
          students. Learn more about how we got started and our mission.
        </p>
        <Separator decorative={true} className="mt-10" />
      </MaxWidthWrapper>
      <MaxWidthWrapper className="flex items-center">
        <div className="mr-20 mt-10 flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Mood Tracking
          </h1>
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
          className="mr-1"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
      </MaxWidthWrapper>
      <MaxWidthWrapper className="flex items-center">
        <Image
          className="ml-1 mt-10"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
        <div className="ml-28 mt-10 flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Personal Journal
          </h1>
          <p>Text here... </p>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper className="flex items-center">
        <div className="mr-20 mt-10 flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Community Forums
          </h1>
          <p>
            Text here. There are multiple features that can help you keep
            track...
          </p>
        </div>
        <Image
          className="mr-1 mt-10"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <Separator decorative={true} className="mt-10" />
        <div>
          <h1 className="mt-10 text-2xl font-semibold lg:text-4xl">
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
