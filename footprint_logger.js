const categoryTotals = {
  "energy-use": 0,
  transportation: 0,
  "food-consumption": 0,
  other: 0,
};

const ctx = document.getElementById("myChart");

const categoryLabels = ["Energy use", "Transportation", "Food", "Other"];
const categoryColors = ["#4A90E2", "#E67E22", "#2E8B57", "#8E44AD"];

const myChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: categoryLabels,
    datasets: [
      {
        label: "CO₂ Emissions by Category",
        data: [0, 0, 0, 0],
        backgroundColor: categoryColors,
        borderWidth: 1,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});

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
  document.getElementById("chart-container").style.display = "none";
  const showVisualBtn = document.getElementById("show-visual-btn");

  // Load existing data from localStorage if available
  showVisualBtn.addEventListener("click", () => {
    const savedData = localStorage.getItem("categoryTotals");
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      // Update the categoryTotals object
      for (const category in parsedData) {
        if (categoryTotals.hasOwnProperty(category)) {
          categoryTotals[category] = parsedData[category];
        }
      }

      // Update the chart's data
      myChart.data.datasets[0].data = [
        categoryTotals["energy-use"],
        categoryTotals["transportation"],
        categoryTotals["food-consumption"],
        categoryTotals["other"],
      ];

      // Show chart container if any value is non-zero
      if (Object.values(categoryTotals).some((val) => val > 0)) {
        document.getElementById("chart-container").style.display = "block";
        myChart.update();
      }
    }
  });

  const categoryRadios = document.querySelectorAll("input[name='group']");
  const categoryActivities = document.getElementById("activity");
  const submitBtn = document.getElementById("submit-btn");
  const totalEmissions = document.getElementById("total-emissions");
  let emissions = 0;

  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const selectedCategory = e.target.value;
      const activities = fillActivities(selectedCategory);

      categoryActivities.innerHTML = "";
      categoryActivities.appendChild(setDefaultSelection());

      activities.forEach((activity) => {
        const option = document.createElement("option");
        const [value, label] = activity.split("-");
        option.value = value;
        option.textContent = label;
        categoryActivities.appendChild(option);
      });
    });
  });

  const formData = {};
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const category = document.querySelector(
      "input[name='group']:checked"
    ).value;
    const activityValue = document.getElementById("activity").value;

    const selectedOption = categoryActivities.value;
    const selectedCategory = document.querySelector(
      "input[name='group']:checked"
    );

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }
    if (!selectedOption || isNaN(parseFloat(selectedOption))) {
      alert("Please select an activity before submitting.");
      return;
    }

    if (formData.hasOwnProperty(category)) {
      formData[category] += parseFloat(activityValue);
    } else {
      formData[category] = parseFloat(activityValue);
    }

    // Get existing totals from localStorage
    const existingData =
      JSON.parse(localStorage.getItem("categoryTotals")) || {};

    // Merge with current formData
    for (const category in formData) {
      if (existingData.hasOwnProperty(category)) {
        existingData[category] += formData[category];
      } else {
        existingData[category] = formData[category];
      }
    }

    // Save the merged data back to localStorage
    localStorage.setItem("categoryTotals", JSON.stringify(existingData));

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`Key: ${key}, Value: ${value}`);
    }

    console.log("collected data: ", formData);

    const value = parseFloat(selectedOption);
    emissions += value;
    totalEmissions.textContent = `Total emissions (kg): ${emissions.toFixed(
      2
    )}`;

    const categoryKey = selectedCategory.value;
    categoryTotals[categoryKey] += value;

    document.getElementById("chart-container").style.display = "block";

    myChart.data.datasets[0].data = [
      categoryTotals["energy-use"],
      categoryTotals["transportation"],
      categoryTotals["food-consumption"],
      categoryTotals["other"],
    ];

    myChart.update();
  });

  console.log("Category totals:", localStorage.getItem("categoryTotals"));
});
