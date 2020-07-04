

chartIt();
async function chartIt(){
	const covid_data = await getData();
	const ctx = document.getElementById('cases').getContext('2d');
	const _ctx = document.getElementById('deaths').getContext('2d');
	const data = {
		labels: covid_data.fecha,
		datasets: [{
			label: `Desde: ${covid_data.fecha[0]} `,
			data: covid_data.ctnCases,
			backgroundColor: 'rgba(217,101,59, 0.2)',
			borderColor: '#D9653B',
			borderWidth: 1
		}]
	}
	const data_deaths = {
		labels: covid_data.fecha,
		datasets: [{
			label: `Desde: ${covid_data.fecha[0]} `,
			data: covid_data.ctnDeaths,
			backgroundColor: 'rgba(245,28,28,.2)',
			borderColor: '#CF3939',
			borderWidth: 1
		}]
	}

	Chart.defaults.LineWithLine = Chart.defaults.line;
	Chart.controllers.LineWithLine = Chart.controllers.line.extend({
		draw: function(ease) {
			Chart.controllers.line.prototype.draw.call(this, ease);
			if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
				let activePoint = this.chart.tooltip._active[0],
				ctx = this.chart.ctx,
				x = activePoint.tooltipPosition().x,
				topY = this.chart.legend.bottom,
				bottomY = this.chart.chartArea.bottom;
				// draw line
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(x, topY);
				ctx.lineTo(x, bottomY);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#5CF29D';
				ctx.stroke();
				ctx.restore();
			}
		}
	});

	const chart = new Chart(ctx, {
		type: 'LineWithLine',
		data: data,
		options: {
			responsive: true,
			tooltips: {
				intersect: false
			}
		}
	});
	const chart_deaths = new Chart(_ctx, {
		type: 'LineWithLine',
		data: data_deaths,
		options: {
			responsive: true,
			tooltips: {
				intersect: false
			}
		}
	});
}

async function getData(){
	let fecha = []; let ctnCases = []; let ctnDeaths = [];
	const response = await fetch('https://pomber.github.io/covid19/timeseries.json');
	//const response = await fetch('./assets/images/timeseries.json');
	//----- End api covid de pomber
	const data = await response.json();
	data['Bolivia'].slice(48).forEach(({date, confirmed, recovered, deaths}) => {
		fecha.push(date);
		ctnCases.push(confirmed);
		ctnDeaths.push(deaths);
	});
	return { fecha, ctnCases, ctnDeaths };
}
