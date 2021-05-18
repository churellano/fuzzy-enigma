import { Component } from 'react'

import { StockMarketServiceContext } from '../../services/StockMarketService';
import Chart from 'chart.js';

class StockChart extends Component {

  constructor() {
    super();
    this.state = {
      chart: null
    }
  }

  componentDidMount() {
    // From https://stackoverflow.com/questions/45159895/moving-vertical-line-when-hovering-over-the-chart-using-chart-js
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      draw: function(ease) {
          Chart.controllers.line.prototype.draw.call(this, ease);

          if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            var activePoint = this.chart.tooltip._active[0],
                ctx = this.chart.ctx,
                x = activePoint.tooltipPosition().x,
                topY = this.chart.legend.bottom,
                bottomY = this.chart.chartArea.bottom;

            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#696969';
            ctx.stroke();
            ctx.restore();
          }
      }
    });

    let ctx = document.getElementById('chart');
    const chart = new Chart(ctx, {
      type: this.props.type,
      data: this.props.data,
      options: this.props.options
    });

    this.setState(({ chart }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type || 
        this.props.data !== prevProps.data || 
        this.props.options !== prevProps.options
    ) {
      this.setState(prevState => {
        const chart = prevState.chart;
        this.removeData(chart);
  
        chart.data = this.props.data;
        chart.options = this.props.options;
        chart.update();
  
        return ({ chart });
      });
    }
  }

  // addData(chart) {
  //   chart.data = this.props.data;
  //   chart
  //   chart.update();
  // }

  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }

  render() {
    return <canvas id="chart"></canvas>;
  }
}

const StockChartComponent = (props) => (
  <StockMarketServiceContext.Consumer>
    {
      (stockMarketService) => 
        <StockChart {...props} stockMarketService={stockMarketService}/>
    }
  </StockMarketServiceContext.Consumer>
);

export default StockChartComponent;
