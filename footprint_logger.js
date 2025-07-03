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
        "Electricity Consumption",
        "Gas Consumption",
        "Water Heating",
        "Heating and Cooling",
      ];
    case "transportation":
      return ["Car Travel", "Public Transport", "Cycling", "Walking"];
    case "food-consumption":
      return [
        "Meat Consumption",
        "Dairy Consumption",
        "Vegetarian Meals",
        "Vegan Meals",
      ];
    case "other":
      return ["Waste Management", "Recycling", "Gardening", "Shopping Habits"];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const categoryRadios = document.querySelectorAll("input[name='group']");

  console.log(categoryRadios);

  let activityId;

  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const categoryActivities = document.getElementsByTagName("select")[0];
      const labels = document.getElementsByTagName("label");
      const activitiesLabel =
        document.getElementsByTagName("label")[labels.length - 1];
      activityId = categoryActivities.id = e.target.value;
      activitiesLabel.for = e.target.value;

      console.log(categoryActivities.id);
      console.log(activitiesLabel.for);
      console.log("Activity ID: ", activityId);

      if (activityId) {
        const activities = fillActivities(activityId);
        categoryActivities.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "-- select --";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        categoryActivities.appendChild(defaultOption);

        activities.forEach((activity) => {
          const option = document.createElement("option");
          option.value = activity.toLowerCase().replace(/\s+/g, "-");
          option.textContent = activity;
          categoryActivities.appendChild(option);
        });
      }
    });
  });
});
