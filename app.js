const transactions = [];

const latestTransaction = {
  description: "", 
  amount: 0, 
  category: ""
};

const categoryTotals = [
  {"category": "Loans", "total": 0},
  {"category": "Investments", "total": 0},
  {"category": "Groceries", "total": 0},
  {"category": "Leisure", "total": 0}
  ];

document.getElementById("submit").addEventListener("click", checkData);

function checkData(e) {
  e.preventDefault();
  let amount = Number(document.getElementById("transactionAmount").value);
  let description = document.getElementById("transactionDescription").value;
  let category = document.getElementById("transactionCategory").value;
  //adding input data to global variable 
  latestTransaction.description = description;
  latestTransaction.amount = Number(amount);
  latestTransaction.category = category;

  //check validity of input
  let vals = Object.values(latestTransaction);
  let validityTest = vals.every((currVal) => {
    if (currVal) {
      return true;
    } else {
      return false;
    }
  })

  if (validityTest) {
    getCategoryTotalData();
    console.log(latestTransaction);
  } else {
    alert("Please fill out every input field with valid characters.");
  }
  let form = document.getElementById("form");
  let amountElement = document.getElementById("transactionAmount");

  form.reset();
  amountElement.focus();
}

function getCategoryTotalData() {
  //updating transacitons
  transactions.unshift(latestTransaction);
  //updating categoryTotals to be able to use data for creating updated percentages later on
  for (let i = 0; i < categoryTotals.length; i++) {
    if (categoryTotals[i].category === latestTransaction.category) {
      categoryTotals[i].total += latestTransaction.amount;
    }
  }
  console.log(categoryTotals);
  displayData();
  updateChartData();
}

function displayData() {
  //two variables below are to match up id of list elements to latest transaction category
  let listIdArray = ["loansList", "investmentsList", "groceriesList", "leisureList"];
  let matchingIdStr = `${latestTransaction.category.toLowerCase()}List`;
  let backgroundList = [
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(34, 230, 138, 0.4)',
    'rgba(255, 159, 64, 0.4)'
  ];

  for (let i = 0; i < listIdArray.length; i++) {
    if (listIdArray[i] === matchingIdStr) {
      let currListElement = document.getElementById(`${matchingIdStr}`);
      currListElement.style.backgroundColor = `${backgroundList[i]}`;
      currListElement.style.border = "2px solid black";
      currListElement.innerHTML += `
      <li>
      <b>$${latestTransaction.amount}</b> : ${latestTransaction.description}
      </li>`;
    }
  }
}

//Chart.js setting up chart 
const labels = [
    `${categoryTotals[0].category}`, 
    `${categoryTotals[1].category}`, 
    `${categoryTotals[2].category}`, 
    `${categoryTotals[3].category}`
];

//setup block
const data = {
   labels: labels,
        datasets: [{
            label: 'Total Spent Per Category',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.4)',
                'rgba(54, 162, 235, 0.4)',
                'rgba(34, 230, 138, 0.4)',
                'rgba(255, 159, 64, 0.4)'
            ],
            borderColor: [
                'rgba(171, 17, 27, 1)',
                'rgba(19, 23, 156, 1)',
                'rgba(15, 110, 66, 1)',
                'rgba(161, 100, 40, 1)'
            ],
            borderWidth: 1
        }]
};

//options block
const options = {
    plugins: {
        legend: {
            display: true,
            position: "right",
            maxHeight: 200,
            labels: {
                boxWidth: 25,
                boxHeight: 25,
                padding: 50,
                textAlign: "center",
                font: {
                  size: 20
                }
            }
        },
        title: {
            display: true,
            align: "center",
            text: "See What Your Spending Looks Like",
            font: {
              size: 25,
              color: "#000"
            }
        } 
    }
};

//config block
const config = {
  type: 'pie',
  data,
  options,
};

//init/render block
let myChart = new Chart (document.getElementById("pieChart").getContext("2d"), config);

function updateChartData() {
  let chartContainer = document.getElementById("chartContainer");
  if (chartContainer.style.visibility === "hidden") {
    chartContainer.style.visibility = "visible";
  }
  const indexNum = labels.indexOf(latestTransaction.category);
  myChart.config.data.datasets[0].data[indexNum] += latestTransaction.amount; 
  myChart.update();
}