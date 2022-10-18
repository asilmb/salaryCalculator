const $goal = $('#goal');
const $moneyPerHour = $('#moneyPerHour');
const $alreadyWorked = $('#alreadyWorked');
const $chartData = {'labels': [], 'data': []};

$goal.on('keyup', function () {
    $goal.removeClass('required')
    calculate()
    updateChart()
});
$moneyPerHour.on('keyup', function () {
    $moneyPerHour.removeClass('required')
    calculate()
    updateChart()
});
$alreadyWorked.on('keyup', function () {
    $alreadyWorked.removeClass('required')
    calculate()
    updateChart()
});

function getHoursPerDay(length) {
    const totalEarned = $moneyPerHour.val() * $alreadyWorked.val()
    const leftToEarn = $goal.val() - totalEarned;
    return (leftToEarn / $moneyPerHour.val()) / length;
}

function validate() {
    let isValid = true;
    if ($moneyPerHour.val() === '') {
        $moneyPerHour.addClass('required')
        isValid = false;
    }
    if ($alreadyWorked.val() === '') {
        $alreadyWorked.addClass('required')
        isValid = false;
    }
    if ($goal.val() === '') {
        $goal.addClass('required')
        isValid = false;
    }
    return isValid
}

function calculate() {
    if (validate() === false) {
        return false;
    }
    $chartData.data = [];
    $chartData.labels = [];
    const today = new Date();
    const weekdays = getWeekdaysInMonth(today.getDate(), today.getMonth(), today.getFullYear());
    const hours = getHoursPerDay(weekdays.length);
    for (const element of weekdays) {
        $chartData.labels.push(element.day + '/' + today.getMonth());
        $chartData.data.push(hours);
    }

}

function updateChart() {
    myChart.data.labels = $chartData.labels
    myChart.data.datasets = [{
        label: 'Hours per day',
        data: $chartData.data,
        backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 2
    }]
    myChart.update()
}


function getWeekdaysInMonth(day, month, year) {
    const days = daysInMonth(month, year);
    let weekdays = [];
    for (let i = day; i < days; i++) {
        if (isWeekday(year, month, i + 1)) {
            weekdays.push({'day': i})
        }
    }
    return weekdays;
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function isWeekday(year, month, day) {
    day = new Date(year, month, day).getDay();
    return day !== 0 && day !== 6;
}

let myChart

$(function(){
    const ctx = $('#myChart');
    myChart = new Chart(ctx, {
        type: 'bar',
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
