import React from "react";
import { View } from "react-native";
import { Svg, Rect, G, Text } from "react-native-svg";
import AbstractChart from "./abstract-chart";

const barWidth = 32;

class BarChart extends AbstractChart {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  renderBars = config => {
    const { data, width, height, paddingTop, paddingRight, barRadius } = config;
    const labelData = data.slice();
    if (this.props.yMax) {
      labelData.push(this.props.yMax);
    }
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, labelData, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Rect
          onPress={() => alert('test')}
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2
          }
          y={
            ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
            paddingTop
          }
          rx={barRadius}
          width={barWidth}
          height={(Math.abs(barHeight) / 4) * 3}
          fill="url(#fillShadowGradient)"
        />
      );
    });
  };

  renderBarTops = config => {
    const { data, width, height, paddingTop, paddingRight } = config;
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Rect
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
          width={barWidth}
          height={2}
          fill={this.props.chartConfig.color(0.6)}
        />
      );
    });
  };

  renderBarText = config => {
    const { data, width, height, paddingTop, paddingRight } = config;
    const labelData = data.slice();
    if (this.props.yMax) {
      labelData.push(this.props.yMax);
    }
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, labelData, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Text
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2
            }
            y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 5}
            fill="white"
            fontSize="12"
            key={Math.random()}
            textAnchor="right">
            {x}
          </Text>
      );
    });
  };

  render() {
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
      showBarTops = true,
      showBarText = true,
      segments = 4,
      decimalPlaces,
    } = this.props;
    const { borderRadius = 0, paddingTop = 16, paddingRight = 64 } = style;
    const config = {
      width,
      height,
      decimalPlaces,
      verticalLabelRotation,
      horizontalLabelRotation,
      barRadius: (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      formatYLabel: (this.props.chartConfig && this.props.chartConfig.formatYLabel) || function(label){return label},
      formatXLabel: (this.props.chartConfig && this.props.chartConfig.formatXLabel) || function(label){return label},
    };
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: segments,
                  paddingTop
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: data.datasets[0].data,
                  paddingTop,
                  paddingRight
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight,
                  paddingTop,
                  horizontalOffset: barWidth * this.getBarPercentage()
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
          </G>
          <G>
            {showBarTops && this.renderBarTops({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
          </G>
          <G>
            {showBarText && this.renderBarText({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default BarChart;
