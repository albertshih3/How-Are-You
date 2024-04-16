import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <>
      <MaxWidthWrapper className="mx-auto flex flex-col sm:py-10">
        <h1 className="text-4xl font-bold lg:text-6xl">About</h1>
        <p className="mt-1 max-w-prose lg:text-lg text-muted-foreground">
          How are you is a mental health application created by students for
          students. Learn more about how we got started and our mission.
        </p>
        <Separator decorative={true} className="mt-4 mb-5" />
      </MaxWidthWrapper>

      {/* Feature 1: Mood Tracking (Desktop) */}
      <MaxWidthWrapper className="hidden sm:flex sm:items-center">
        <div className="mr-20 mt-10 flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Mood Tracking
          </h1>
          <p>
            Track your mood with our mood tracker! Log your emotions daily and
            view trends related to your emotions. You can also add notes or
            journal entries to your mood logs to help you understand your
            emotions better.
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

      {/* Feature 1: Mood Tracking (MOBILE) */}
      <MaxWidthWrapper className="sm:hidden flex flex-col items-center mb-3">
        <Image
          className="mb-5"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
        <div className="flex flex-col m-3">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Mood Tracking
          </h1>
          <p>
            Track your mood with our mood tracker! Log your emotions daily and
            view trends related to your emotions. You can also add notes or
            journal entries to your mood logs to help you understand your
            emotions better.
          </p>
        </div>
        <Separator decorative={true} className="mt-4 mb-5" />
      </MaxWidthWrapper>

      {/* Feature 2: Personal Journal (Desktop) */}
      <MaxWidthWrapper className="hidden sm:flex sm:items-center">
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
          <p>
            Take advantage of our personal journal feature to write down your
            thoughts and feelings. You can also add photos to your journal
            entries to help you remember special moments. Our journal feature is
            private and secure, so you can feel comfortable expressing yourself
            without worrying about your data being shared with others. You can
            also link journal entries to our mood tracker for a deeper
            understanding of your emotions.
          </p>
        </div>
      </MaxWidthWrapper>

      {/* Feature 2: Personal Journal (MOBILE) */}
      <MaxWidthWrapper className="sm:hidden flex flex-col items-center mb-3">
        <Image
          className="mb-5"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
        <div className="flex flex-col m-3">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Personal Journal
          </h1>
          <p>
            Take advantage of our personal journal feature to write down your
            thoughts and feelings. You can also add photos to your journal
            entries to help you remember special moments. Our journal feature is
            private and secure, so you can feel comfortable expressing yourself
            without worrying about your data being shared with others. You can
            also link journal entries to our mood tracker for a deeper
            understanding of your emotions.
          </p>
        </div>
        <Separator decorative={true} className="mt-4 mb-5" />
      </MaxWidthWrapper>

      {/* Feature 3: Community Forums (Desktop) */}
      <MaxWidthWrapper className="hidden sm:flex sm:items-center">
        <div className="mr-20 mt-10 flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Community Forums
          </h1>
          <p>
            Take part in our community forums to share your thoughts and
            feelings with others. You can also access curated resources to learn
            more about mental health and education. These resources are designed
            specifically for college students.
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

      {/* Feature 3: Community Forums (MOBILE) */}
      <MaxWidthWrapper className="sm:hidden flex flex-col items-center mb-3">
        <Image
          className="mb-5"
          src="https://placehold.co/600x400"
          width={500}
          height={500}
          alt="Placeholder image"
        />
        <div className="flex flex-col m-3">
          <h1 className="mb-1 text-2xl font-semibold lg:text-4xl">
            Community Forums
          </h1>
          <p>
            Take part in our community forums to share your thoughts and
            feelings with others. You can also access curated resources to learn
            more about mental health and education. These resources are designed
            specifically for college students.
          </p>
        </div>
      </MaxWidthWrapper>

      {/* Commitment to Privacy */}
      <MaxWidthWrapper className="mb-10">
        <Separator decorative={true} className="mt-5" />
        <div className="m-2 sm:m-0 pb-10">
          <h1 className="mt-10 text-2xl mb-2 font-semibold lg:text-4xl">
            Our Commitment to Privacy
          </h1>
          <p className="pb-5">
            How are you is committed to protecting your privacy. We collect
            analytics data but we do not share your data with third parties. We
            are committed to providing a safe and secure environment for our
            users to express themselves and seek help. If you have any questions
            or
            {/*eslint-disable-next-line react/no-unescaped-entities*/}
            concerns about our privacy policy, please don't hesitate to contact
            us. We are here to help. View our full privacy policy here.
          </p>
          <Link href="/privacy-policy">
            <Button
              variant="expandIcon"
              Icon={ArrowRight}
              iconPlacement="right"
            >
              View Privacy Policy
            </Button>
          </Link>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default AboutPage;
