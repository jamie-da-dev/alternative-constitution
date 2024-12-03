// src/components/Index.tsx

const Index = () => {
  return (
    <main className="flex-1 p-2 min-h-screen ml-[500px]">
      <header className="bg-gray-800 text-white p-4 rounded-md shadow-md mb-8">
        <h1 className="text-3xl font-bold text-center">
          Alternative Constitution
        </h1>
      </header>

      <div className="p-4 mx-auto space-y-10">
        <h2 className="text-center text-2xl font-bold">Welcome</h2>

        <p>
          You have reached the place to find information about an{" "}
          <strong>Alternative Constitution</strong> to that being proposed for
          adoption by RNZRSA.
        </p>

        <p>
          This site is promoted by a group of RSAs who believe the proposed
          RNZRSA Board rules are undemocratic and not in the best interests of
          local RSAs and Affiliate organisations.
        </p>

        <section>
          <h3 className="text-xl font-semibold mb-3">
            The Special General Meeting
          </h3>
          <p>
            The Board has scheduled a{" "}
            <strong>Special General Meeting and National Council</strong> for
            <strong> 15 February 2025</strong> to vote on adopting their New
            Constitution.
          </p>
          <p className="text-lg ">
            We strongly recommend you vote{" "}
            <span className="text-red-600 font-bold">NO</span> to that motion.
          </p>
          <p className="text-lg">
            Instead, we propose voting{" "}
            <span className="text-green-600 font-bold">YES</span> to the
            Alternative Constitution.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Our Argument</h3>
          <p>
            We explain on this website why you should not support the RNZRSA
            motion, and instead vote{" "}
            <span className="text-green-600 font-bold">YES</span> for the
            <strong> Alternative Constitution</strong>.
          </p>
          <p>
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
          <p>
            You can also read the full version of the{" "}
            <strong>Alternative Constitution</strong> we propose to be adopted,
            along with an <strong>Explanation Sheet</strong> that addresses each
            amendment, clause by clause, with our recommendations for governing
            the RNZRSA going forward.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Additional Resources</h3>
          <p>
            There are also individual sheets that examine and explain specific
            aspects that you should be aware of.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Get Involved</h3>
          <p>
            You can download any item for your use, and if you wish to make a
            comment, please email us at{" "}
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
