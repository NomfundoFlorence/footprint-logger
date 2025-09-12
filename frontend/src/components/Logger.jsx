import { useState } from "react";

export default function Logger() {
  const activitiesData = {
    "energy-use": [
      "1.5-Electricity Consumption",
      "2-Gas Consumption",
      "1.8-Water Heating",
      "0.09-Watching TV",
      "0.1-Computer use",
      "0.06-Lights on",
      "0.7-Washing laundry",
      "0.5-Dish washer",
      "2.2-Heaters and/or Air conditioners",
      "1-Cooking",
    ],
    transportation: [
      "0.21-Traveling by car",
      "0.22-Traveling by taxi",
      "0.05-Traveling by train",
      "0.1-Traveling by bus",
      "0.285-Traveling by flight",
    ],
    "food-consumption": [
      "5-Red meat",
      "2-Dairy products",
      "1.5-Vegetarian meals",
      "0.9-Vegan meals",
    ],
    other: ["1.5-Waste Management", "0.2-Gardening", "2-Shopping Habits"],
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedActivity(""); // reset activity when category changes
  };

  const handleActivityChange = (event) => {
    setSelectedActivity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedCategory || !selectedActivity) {
      alert("Please select a category and an activity before submitting.");
      return;
    }

    console.log("Selected category:", selectedCategory);
    console.log("Selected activity value:", selectedActivity);

    // You can add Chart.js updates or localStorage logic here
  };

  const activities = selectedCategory ? activitiesData[selectedCategory] : [];

  return (
    <>
      <div className="absolute inset-0 h-screen bg-[url('https://images.unsplash.com/photo-1635695604201-2b718204bccb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8A%3D%3D')] bg-cover bg-center filter blur-[4px] md:blur-[6px] md:transform md:scale-x-[-1]"></div>
      <div className="relative flex w-screen h-screen items-top justify-center xl:justify-start">
        <form
          id="activity-form"
          onSubmit={handleSubmit}
          className="flex flex-col justify-center bg-green-50 h-[73.4286%] w-11/12 border-0 rounded-b-[50px] rounded-t-sm md:w-1/2 sm:h-screen sm:rounded-b-none">
          <fieldset className="h-[155px] flex flex-col p-4 m-4">
            <legend className="ml-auto mr-auto text-xl text-green-950 font-bold mb-2 sm:text-2xl">
              Select category
            </legend>
            {Object.keys(activitiesData).map((key) => (
              <div className="radio-label mb-2 " key={key}>
                <input
                  type="radio"
                  name="group"
                  id={key}
                  value={key}
                  checked={selectedCategory === key}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={key}>
                  {key
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
              </div>
            ))}
          </fieldset>

          <div
            id="activity-container"
            className="h-[250px] flex flex-col border-t-2 border-gray-300 pl-4 pr-4 pt-8 pd-4 rounded ml-4 mr-4 mt-16 md-4">
            <label
              htmlFor="activity"
              className="ml-auto mr-auto text-xl text-green-950 font-bold mb-2 sm:text-2xl">
              Select activity
            </label>
            <select
              name="activity"
              id="activity"
              value={selectedActivity}
              onChange={handleActivityChange}
              disabled={!selectedCategory}
              className="bg-green-200 mb-5 h-9 hover:bg-green-300 border-b border-green-500">
              <option value="">-- select --</option>
              {activities.map((activity) => {
                const [value, label] = activity.split("-");
                return (
                  <option key={label} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            type="submit"
            id="submit-btn"
            className="block bg-blue-500 w-2/4 ml-auto mr-auto mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full sm:w-1/3">
            Submit activity
          </button>
        </form>
      </div>
    </>
  );
}
