// src/components/Index.tsx

const Index = () => {
  return (
    <main className="flex-1 p-2 min-h-screen ml-[0px] lg:ml-[400px] xl:ml-[515px]">
      <header className="bg-gray-800 text-white p-4 rounded-md shadow-md mb-4">
        <h1 className="text-3xl font-bold text-center">
          Alternative Constitution
        </h1>
      </header>

      <div className="p-4 mx-auto space-y-10">
        <section>
          <h2 className="text-center text-2xl font-bold mb-6">Welcome</h2>
          <p className="text-lg mb-3">
            You have reached the place to find information about an{" "}
            <strong>Alternative Constitution</strong> to that being proposed for
            adoption by RNZRSA.
          </p>
          <p className="text-lg">
            This site is promoted by a group of RSAs that believe what the Board
            of RNZRSA is proposing to replace the existing rules is undemocratic
            and not in the best interests of local RSAs and Affiliate
            organisations.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">
            The Special General Meeting
          </h3>
          <p className="mb-3 text-lg">
            The Board has scheduled a{" "}
            <strong>Special General Meeting and National Council</strong> for
            <strong> 15 February 2025</strong> to have you vote to adopt their
            New Constitution.
          </p>
          <p className="mb-3 text-lg">
            We strongly recommend you vote{" "}
            <span className="text-red-600 font-bold">NO</span> to that motion.
          </p>
          <p className="text-lg">
            Instead, we have submitted a Notice of Motion that asks you to vote{" "}
            <span className="text-green-600 font-bold">YES</span> to the
            <strong> Alternative Constitution</strong>.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Our Argument</h3>
          <p className="mb-3 text-lg">
            We explain on this website why you should not support the RNZRSA
            motion, and instead vote{" "}
            <span className="text-green-600 font-bold">YES</span> for the
            <strong> Alternative Constitution</strong>.
          </p>
          <p className="mb-3 text-lg">
            The RNZRSA says “they have listened and made changes” to their
            proposed constitution, so where is the revised version with the
            changes incorporated? That is being held back to only be released
            just before Christmas so you have minimal time to read it. The
            Alternative Constitution is not relying on old information. We are
            aware of what has been proposed. Such as the President being a Board
            Member. We oppose that change because it compromises the President.
            The ITF Report in 2014 said it should never happen, and we agree. We
            are aware that they have now proposed every RSA gets two votes. That
            is not democracy. It is a cynical way of giving the same votes from
            a tiny RSA as one with hundreds and even thousands of members. We
            explain our opposition further in the Listen Up series.
          </p>
          <p className="text-lg">
            Click on a subject item in the <strong>Menu</strong> to read our
            take on what the Board is proposing and why it should not be
            approved for an RNZRSA that cherishes natural justice, common sense,
            and the founding principles of comradeship and remembrance.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">
            Download the Full Version
          </h3>
          <p className="text-lg">
            You can also read the full version of the{" "}
            <strong>Alternative Constitution</strong> we propose is adopted, and
            there is also an <strong>Explanation Sheet</strong> that addresses
            each amendment, clause by clause, and our argument why we recommend
            our approach to governing the RNZRSA going forward.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Get Involved</h3>
          <p className="text-lg">
            You can download any item for your use, and if you wish to make a
            comment, please email{" "}
            <a
              href="mailto:admin@alternativeconstitution.nz"
              className="text-blue-500 font-medium"
            >
              admin@alternativeconstitution.nz
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
};

export default Index;
