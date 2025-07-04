const ctx = document.getElementById("myChart");

new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// linking radio selection to select dropdown

function fillActivities(category) {
  switch (category) {
    case "energy-use":
      return [
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
      ];
    case "transportation":
      return [
        "0.21-Traveling by car",
        "0.22-Traveling by taxi",
        "0.05-Traveling by train",
        "0.1-Traveling by bus",
        "0.285-Traveling by flight",
      ];
    case "food-consumption":
      return [
        "5-Red meat",
        "2-Dairy products",
        "1.5-Vegetarian meals",
        "0.9-Vegan meals",
      ];
    case "other":
      return ["1.5-Waste Management", "0.2-Gardening", "2-Shopping Habits"];
  }
}

function setDefaultSelection() {
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "-- select --";
  defaultOption.disabled = true;
  defaultOption.selected = true;

  return defaultOption;
}

document.addEventListener("DOMContentLoaded", () => {
  const categoryRadios = document.querySelectorAll("input[name='group']");

  // console.log(categoryRadios);

  let activityId, activities;

  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const categoryActivities = document.getElementsByTagName("select")[0];
      const labels = document.getElementsByTagName("label");
      const activitiesLabel =
        document.getElementsByTagName("label")[labels.length - 1];
      activityId = categoryActivities.id = e.target.value;
      activitiesLabel.for = e.target.value;

      if (activityId) {
        activities = fillActivities(activityId);
        categoryActivities.innerHTML = "";
        const defaultOption = setDefaultSelection();
        categoryActivities.appendChild(defaultOption);

        activities.forEach((activity) => {
          const option = document.createElement("option");
          // console.log(activity.split("-"));

          option.value = activity
            .split("-")[0]
            .toLowerCase()
            .replace(/\s+/g, "-");
          option.textContent = activity.split("-")[1];
          categoryActivities.appendChild(option);
        });
      }
    });
  });

  const submitBtn = document.getElementById("submit-btn");
  const totalEmissions = document.getElementById("total-emissions");
  let emissions = 0;

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const selectedOption = document.querySelector(
      "select[name='activity']"
    ).value;

    if (!selectedOption || isNaN(parseFloat(selectedOption))) {
      alert("Please select an activity before submitting.");
      return;
    }

    emissions += parseFloat(selectedOption);
    totalEmissions.textContent = `Total emissions (kg): ${emissions.toFixed(
      2
    )}`;
  });
});
