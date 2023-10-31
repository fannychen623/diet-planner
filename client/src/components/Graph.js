// import packages
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Chart from 'react-apexcharts'

// functional component of graphs to be rendered on the progress page
// pass in data, date and graph type information
const Graph = ({ data, date, graphType }) => {

	const isMobile = useMediaQuery({ query: `(max-width: 480px)` });

	// set the date range
	const [dateRange, setDateRange] = useState({ start: new Date(date.start).getTime(), end: new Date(date.end).getTime() })

	// convert dates to time format
	const convertDates = () => {
		let weight = data.weight.map(entry => ({
			date: new Date(entry.date).getTime(),
			weight: entry.weight
		}))
		let nutrition = data.nutrition.map(entry => ({
			date: new Date(entry.date).getTime(),
			calories: entry.calories,
			carbs: entry.carbs,
			fat: entry.fat,
			protein: entry.protein,
			sodium: entry.sodium,
			sugar: entry.sugar
		}))
		return { weight, nutrition };
	}

	// filter data based on date range
	const filterData = () => {
		let weight = []
		convertDates().weight.forEach((entry) => {
			if (entry.date >= dateRange.start && entry.date <= dateRange.end) {
				weight.push({ date: entry.date, weight: entry.weight })
			}
		})
		let nutrition = []
		convertDates().nutrition.forEach((entry) => {
			if (entry.date >= dateRange.start && entry.date <= dateRange.end) {
				nutrition.push({
					date: entry.date,
					calories: entry.calories,
					carbs: entry.carbs,
					fat: entry.fat,
					protein: entry.protein,
					sodium: entry.sodium,
					sugar: entry.sugar
				})
			}
		})
		return { weight, nutrition };
	}

	// set array of filtered weight and nutrition data
	const [weightData, setWeightData] = useState(filterData().weight)
	const [nutritionData, setNutritionData] = useState(filterData().nutrition)

	// function to calculate the average over the date range
	const calculateAverage = () => {
		
	}

	// define the different combination of data series
	// blank series on initial render or incomplete variables
	const blankSeries = [{
		type: 'line',
		name: 'None',
		data: weightData.map(entry => ({ x: entry.date, y: entry.weight }))
	}]

	const weightSeries = [{
		type: 'line',
		name: 'Weight',
		data: weightData.map(entry => ({ x: entry.date, y: entry.weight }))
	}]

	const calorieSeries = [{
		type: 'line',
		name: 'Calorie',
		data: nutritionData.map(entry => ({ x: entry.date, y: entry.calories }))
	}]

	const carbsSeries = [{
		type: 'line',
		name: 'Carbohydrate',
		data: nutritionData.map(entry => ({ x: entry.date, y: entry.carbs }))
	}]

	const fatSeries = [{
		type: 'line',
		name: 'Fat',
		data: nutritionData.map(entry => ({ x: entry.date, y: entry.fat }))
	}]

	const proteinSeries = [{
		type: 'line',
		name: 'Protein',
		data: nutritionData.map(entry => ({ x: entry.date, y: entry.protein }))
	}]

	const sodiumSeries = [{
		type: 'line',
		name: 'Sodium',
		data: nutritionData.map(entry => ({ x: entry.date, y: entry.sodium }))
	}]

	const sugarSeries = [{
		type: 'line',
		name: 'Sugar',
		data: nutritionData.map(entry => ({ x: entry.date, y: entry.sugar }))
	}]

	const weightCalorieSeries = [
		{
			type: 'line',
			name: 'Weight',
			data: weightData.map(entry => ({ x: entry.date, y: entry.weight }))
		},
		{
			type: 'column',
			name: 'Calorie',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.calories }))
		}
	]

	const weightMacronutrientsSeries = [
		{
			type: 'line',
			name: 'Weight',
			data: weightData.map(entry => ({ x: entry.date, y: entry.weight }))
		},
		{
			type: 'line',
			name: 'Carbohydrate',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.carbs }))
		},
		{
			type: 'line',
			name: 'Fat',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.fat }))
		},
		{
			type: 'line',
			name: 'Protein',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.protein }))
		}
	]

	const calorieMacronutrientsSeries = [
		{
			type: 'column',
			name: 'Calorie',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.calories }))
		},
		{
			type: 'line',
			name: 'Carbohydrate',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.carbs }))
		},
		{
			type: 'line',
			name: 'Fat',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.fat }))
		},
		{
			type: 'line',
			name: 'Protein',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.protein }))
		}
	]

	const macronutrientsSeries = [
		{
			type: 'line',
			name: 'Carbohydrate',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.carbs }))
		},
		{
			type: 'line',
			name: 'Fat',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.fat }))
		},
		{
			type: 'line',
			name: 'Protein',
			data: nutritionData.map(entry => ({ x: entry.date, y: entry.protein }))
		}
	]

	// set graph details
	const [graphDetails, setGraphDetails] = useState({
		title: 'Select Graph Type',
		subtitle: 'Date Range',
		series: blankSeries,
		format: 'M/d/y',
		yAxis: '',
		yAxisLabel1: '',
		yAxisLabel2: ''
	})

	// set y axis options
	const yAxis1 = {
		title: {
			text: graphDetails.yAxisLabel1,
			style: {
				fontSize: '1rem',
				fontWeight: 'bold',
				color: 'var(--shade5)',
			},
		},
		labels: {
			formatter: function (val) {
				return val.toFixed(0);
			}
		},
		axisBorder: {
			show: true,
			color: 'var(--shade5)',
		},
	}

	const yAxis2 = [{
		title: {
			text: graphDetails.yAxisLabel1,
			style: {
				fontSize: '1rem',
				fontWeight: 'bold',
				color: 'var(--shade5)',
			},
		},
		labels: {
			formatter: function (val) {
				return val.toFixed(0);
			}
		},
		axisBorder: {
			show: true,
			color: 'var(--shade5)',
		},
	}, {
		opposite: true,
		title: {
			text: graphDetails.yAxisLabel2,
			style: {
				fontSize: '1rem',
				fontWeight: 'bold',
				color: 'var(--shade5)',
			},
		},
		labels: {
			formatter: function (val) {
				return val.toFixed(0);
			}
		},
		axisBorder: {
			show: true,
			color: 'var(--shade5)',
		},
	}]

	// define chart settings/options
	const options = {
		chart: {
			fontFamily: 'var(--font)'
		},
		title: {
			text: graphDetails.title,
			align: 'left',
			margin: 30,
			offsetX: 15,
			offsetY: 30,
			floating: false,
			style: {
				fontSize: '2rem',
				fontWeight: 'bold',
				color: 'var(--shade5)',
			},
		},
		subtitle: {
			text: graphDetails.subtitle,
			margin: 0,
			offsetX: 15,
			offsetY: 80,
			style: {
				fontSize: '1rem',
				fontWeight: 'bold',
				color: 'var(--shade4)',
			},
		},
		xaxis: {
			type: 'datetime',
			labels: { format: graphDetails.format },
			title: {
				text: 'Date',
				style: {
					fontSize: '1rem',
					fontWeight: 'bold',
					color: 'var(--shade5)',
				},
			},
			axisBorder: {
				show: true,
				color: 'var(--shade5)',
			},
		},
		yaxis: graphDetails.yAxis || yAxis1,
		markers: { size: 5 },
		colors: ['#a7d489', '#6baee1', '#ffef85', '#f6ac69', '#ff6972', '#9f7dad'],
		grid: {
			xaxis: {
				lines: { show: false }
			},
			yaxis: {
				lines: { show: false }
			},
			padding: {
				top: 0,
				right: 15,
				bottom: 20,
				left: 15
			},
		},
		tooltip: {
			enabled: true,
			style: {
				fontSize: '12px',
			},
			onDatasetHover: {
				highlightDataSeries: false,
			},
			x: {
				show: true,
				format: 'MMM-dd-yyyy',
			},
		},
		legend: {
			show: true,
			showForSingleSeries: true,
			showForNullSeries: true,
			showForZeroSeries: true,
			position: 'top',
			horizontalAlign: 'right',
			floating: false,
			fontSize: '20px',
			offsetX: 0,
			offsetY: -75,
			markers: {
				width: 15,
				height: 15,
				radius: 10,
			},
			itemMargin: {
				horizontal: 10,
				vertical: 0
			},
		},
		noData: {
			text: 'No data available',
			align: 'center',
			verticalAlign: 'middle',
			style: {
				color: 'var(--shade5)',
				fontSize: '2rem',
			}
		}
	};

	// call on render and state changes
	useEffect(() => {
		// set date range
		setDateRange({ ...dateRange, start: new Date(date.start).getTime(), end: new Date(date.end).getTime() })
		// if all variables available, set data and graph details based on variables
		if (!isNaN(dateRange.start) && !isNaN(dateRange.end) && graphType !== '') {
			setWeightData(filterData().weight)
			setNutritionData(filterData().nutrition)
			if (new Date(dateRange.end - dateRange.start).getDate() > 60) {
				setGraphDetails({ ...graphDetails, format: 'M/d/yy' })
			} else if (new Date(dateRange.end - dateRange.start).getDate() > 30) {
				setGraphDetails({ ...graphDetails, format: 'M/d' })
			} else if (new Date(dateRange.end - dateRange.start).getDate() > 10) {
				setGraphDetails({ ...graphDetails, format: 'MMM/dd' })
			}
			if (graphType === 'Weight') {
				setGraphDetails({
					...graphDetails,
					title: 'Weight Trend',
					subtitle: date.start + ' to ' + date.end,
					series: weightSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Weight (lbs)'
				})
			} else if (graphType === 'Calorie') {
				setGraphDetails({
					...graphDetails,
					title: 'Calorie Trend',
					subtitle: date.start + ' to ' + date.end,
					series: calorieSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Calorie (kcal)'
				})
			} else if (graphType === 'Carbohydrate') {
				setGraphDetails({
					...graphDetails,
					title: 'Carbohydrate Trend',
					subtitle: date.start + ' to ' + date.end,
					series: carbsSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Carbohydrate (g)'
				})
			} else if (graphType === 'Fat') {
				setGraphDetails({
					...graphDetails,
					title: 'Fat Trend',
					subtitle: date.start + ' to ' + date.end,
					series: fatSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Fat (g)'
				})
			} else if (graphType === 'Protein') {
				setGraphDetails({
					...graphDetails,
					title: 'Protein Trend',
					subtitle: date.start + ' to ' + date.end,
					series: proteinSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Protein (g)'
				})
			} else if (graphType === 'Sodium') {
				setGraphDetails({
					...graphDetails,
					title: 'Sodium Trend',
					subtitle: date.start + ' to ' + date.end,
					series: sodiumSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Sodium (mg)'
				})
			} else if (graphType === 'Sugar') {
				setGraphDetails({
					...graphDetails,
					title: 'Sugar Trend',
					subtitle: date.start + ' to ' + date.end,
					series: sugarSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Sugar (g)'
				})
			} else if (graphType === 'Weight + Calorie') {
				setGraphDetails({
					...graphDetails,
					title: 'Weight & Calorie Trend',
					subtitle: date.start + ' to ' + date.end,
					series: weightCalorieSeries,
					yAxis: yAxis2,
					yAxisLabel1: 'Weight (lbs)',
					yAxisLabel2: 'Calorie (kcal)'
				})
			} else if (graphType === 'Weight + Macronutrients') {
				setGraphDetails({
					...graphDetails,
					title: 'Weight & Nutrition Trend',
					subtitle: date.start + ' to ' + date.end,
					series: weightMacronutrientsSeries,
					yAxis: yAxis2,
					yAxisLabel1: 'Weight (lbs)',
					yAxisLabel2: 'Nutrient (g)'
				})
			} else if (graphType === 'Calorie + Macronutrients') {
				setGraphDetails({
					...graphDetails,
					title: 'Calorie & Nutrition Trend',
					subtitle: date.start + ' to ' + date.end,
					series: calorieMacronutrientsSeries,
					yAxis: yAxis2,
					yAxisLabel1: 'Calorie (kcal)',
					yAxisLabel2: 'Nutrient (g)'
				})
			} else if (graphType === 'Macronutrients') {
				setGraphDetails({
					...graphDetails,
					title: 'Nutrition (Carbs, Fat, Protein) Trend',
					subtitle: date.start + ' to ' + date.end,
					series: macronutrientsSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Nutrient (g)'
				})
			}
		}
		// call function on change of passed details
	}, [data, date, graphType])

	return (
		<Chart
			options={options}
			series={graphType ? (graphDetails.series) : ([])}
			width={isMobile ? '100%': '90%'}
			height={isMobile ? '50%': '80%'}
		/>
	);
};

export default Graph;