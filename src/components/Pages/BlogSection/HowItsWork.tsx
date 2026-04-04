const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Search Medicine",
      description:
        "Find your required medicines quickly using our smart search.",
      icon: (
        <svg
          className="w-12 h-12 text-cyan-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Upload Prescription",
      description:
        "Upload your doctor’s prescription securely to get exact medicines.",
      icon: (
        <svg
          className="w-12 h-12 text-cyan-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 12H8m0 0v-4m0 4v4m6-4v-4m0 4v4"
          />
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Fast Delivery",
      description:
        "Get your medicines delivered at your doorstep quickly and safely.",
      icon: (
        <svg
          className="w-12 h-12 text-cyan-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12h18m-6 6h6m-6-12h6m-6 0v12"
          />
          <circle
            cx="9"
            cy="18"
            r="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          How Pharmadoor Works
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Follow these simple steps to get your medicines delivered hassle-free.
        </p>

        <div className="flex flex-col md:flex-row md:justify-center md:space-x-12 space-y-12 md:space-y-0">
          {steps.map(({ id, title, description, icon }) => (
            <div key={id} className="bg-white rounded-lg p-6 shadow-md flex-1">
              <div className="mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
