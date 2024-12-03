export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-lg text-gray-800 mb-6">
          Sorry, something went wrong. Please try again later.
        </p>
        <a
          href="/"
          className="inline-block text-indigo-600 hover:underline text-sm"
        >
          Go back to home
        </a>
      </div>
    </div>
  );
}
