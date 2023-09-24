// import package
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'

// functional component for the line graphs on the tracker page
const LineGraph = ({ data, date, graphType }) => {

	const [dateRange, setDateRange] = useState({ start: new Date(date.start).getTime(), end: new Date(date.end).getTime() })

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

	const [weightData, setWeightData] = useState(filterData().weight)
	const [nutritionData, setNutritionData] = useState(filterData().nutrition)

	useEffect(() => {
		setDateRange({ ...dateRange, start: new Date(date.start).getTime(), end: new Date(date.end).getTime() })
		if (!isNaN(dateRange.start) && !isNaN(dateRange.end) && graphType !== '') {
			setWeightData(filterData().weight)
			setNutritionData(filterData().nutrition)
			setGraphDetails({ ...graphDetails, subtitle: date.start + ' to ' + date.end })
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
					series: weightSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Weight (lbs)'
				})
			} else if (graphType === 'Calorie') {
				setGraphDetails({
					...graphDetails,
					title: 'Calorie Trend',
					series: calorieSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Calorie (kcal)'
				})
			} else if (graphType === 'Carbohydrate') {
				setGraphDetails({
					...graphDetails,
					title: 'Carbohydrate Trend',
					series: carbsSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Carbohydrate (g)'
				})
			} else if (graphType === 'Fat') {
				setGraphDetails({
					...graphDetails,
					title: 'Fat Trend',
					series: fatSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Fat (g)'
				})
			} else if (graphType === 'Protein') {
				setGraphDetails({
					...graphDetails,
					title: 'Protein Trend',
					series: proteinSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Protein (g)'
				})
			} else if (graphType === 'Sodium') {
				setGraphDetails({
					...graphDetails,
					title: 'Sodium Trend',
					series: sodiumSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Sodium (mg)'
				})
			} else if (graphType === 'Sugar') {
				setGraphDetails({
					...graphDetails,
					title: 'Sugar Trend',
					series: sugarSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Sugar (g)'
				})
			} else if (graphType === 'Weight + Calorie') {
				setGraphDetails({
					...graphDetails,
					title: 'Weight & Calorie Trend',
					series: weightCalorieSeries,
					yAxis: yAxis2,
					yAxisLabel1: 'Weight (lbs)',
					yAxisLabel2: 'Calorie (kcal)'
				})
			} else if (graphType === 'Weight + Macronutrients') {
				setGraphDetails({
					...graphDetails,
					title: 'Weight & Nutrition Trend',
					series: weightMacronutrientsSeries,
					yAxis: yAxis2,
					yAxisLabel1: 'Weight (lbs)',
					yAxisLabel2: 'Nutrient (g)'
				})
			} else if (graphType === 'Calorie + Macronutrients') {
				setGraphDetails({
					...graphDetails,
					title: 'Calorie & Nutrition Trend',
					series: calorieMacronutrientsSeries,
					yAxis: yAxis2,
					yAxisLabel1: 'Calorie (kcal)',
					yAxisLabel2: 'Nutrient (g)'
				})
			} else if (graphType === 'Macronutrients') {
				setGraphDetails({
					...graphDetails,
					title: 'Nutrition (Carbs, Fat, Protein) Trend',
					series: macronutrientsSeries,
					yAxis: yAxis1,
					yAxisLabel1: 'Nutrient (g)'
				})
			}
		}
	}, [data, date, graphType])

	const blankSeries = [{
		type: 'line',
		name: 'None',
		data: weightData.map(entry => ({ x: entry.date, y: entry.weight }))
	}]

	const [graphDetails, setGraphDetails] = useState({
		title: 'Select Graph Type',
		subtitle: 'Date Range',
		series: blankSeries,
		format: 'M/d/y',
		yAxis: '',
		yAxisLabel1: '',
		yAxisLabel2: ''
	})

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

	return (
		<Chart
			options={options}
			series={graphDetails.series}
			width='90%'
			height='80%'
		/>
	);
};

export default LineGraph;