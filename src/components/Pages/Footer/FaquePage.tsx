import { Collapse } from "antd";

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#005E6A] mb-6">FAQ</h1>

      <Collapse
        items={[
          {
            key: "1",
            label: "How to order medicine?",
            children: "Select medicine and click buy now.",
          },
          {
            key: "2",
            label: "Is delivery available all over Bangladesh?",
            children: "Yes, we deliver nationwide.",
          },
        ]}
      />
    </div>
  );
};

export default FAQ;
