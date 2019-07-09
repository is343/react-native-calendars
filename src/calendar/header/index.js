import PropTypes from "prop-types";
import React, { Component } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import XDate from "xdate";
import { weekDayNames } from "../../dateutils";
import { CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW } from "../../testIDs";
import styleConstructor from "./style";

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func,
    onHeaderDatePress: PropTypes.func,
    onHeaderLayout: PropTypes.func,
  }

  static defaultProps = {
    monthFormat: "MMMM yyyy",
  }

  constructor(props) {
    super(props)
    this.style = styleConstructor(props.theme)
    this.addMonth = this.addMonth.bind(this)
    this.substractMonth = this.substractMonth.bind(this)
    this.onPressLeft = this.onPressLeft.bind(this)
    this.onPressRight = this.onPressRight.bind(this)
  }

  addMonth() {
    this.props.addMonth(1)
  }

  substractMonth() {
    this.props.addMonth(-1)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.month.toString("yyyy MM") !== this.props.month.toString("yyyy MM")) {
      return true
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true
    }
    return false
  }

  onPressLeft() {
    const { onPressArrowLeft } = this.props
    if (typeof onPressArrowLeft === "function") {
      return onPressArrowLeft(this.substractMonth)
    }
    return this.substractMonth()
  }

  onPressRight() {
    const { onPressArrowRight } = this.props
    if (typeof onPressArrowRight === "function") {
      return onPressArrowRight(this.addMonth)
    }
    return this.addMonth()
  }

  render() {
    let leftArrow = <View />
    let rightArrow = <View />
    let weekDaysNames = weekDayNames(this.props.firstDay)
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.onPressLeft}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={CHANGE_MONTH_LEFT_ARROW}
        >
          {this.props.renderArrow ? (
            this.props.renderArrow("left")
          ) : (
            <Image source={require("../img/previous.png")} style={this.style.arrowImage} />
          )}
        </TouchableOpacity>
      )
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={CHANGE_MONTH_RIGHT_ARROW}
        >
          {this.props.renderArrow ? (
            this.props.renderArrow("right")
          ) : (
            <Image source={require("../img/next.png")} style={this.style.arrowImage} />
          )}
        </TouchableOpacity>
      )
    }
    const {onHeaderDatePress} = this.props
    let indicator
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator style={onHeaderDatePress && {paddingRight: 10}}/>
    }
    return (
      <View
        onLayout={event => {
          if(this.props.onHeaderLayout && typeof this.props.onHeaderLayout === "function"){
            this.props.onHeaderLayout(event);
          }
        }}
      >
        <View style={this.style.header}>
          {leftArrow}
          <TouchableOpacity 
            disabled={!onHeaderDatePress}
            onPress={onHeaderDatePress}
            style={[{ flexDirection: "row" },
            onHeaderDatePress && {
                borderWidth: 1,
                borderRadius: 35,
                borderColor: "white",
              },
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[this.style.monthText]}
              accessibilityTraits="header"
            >
              {this.props.month.toString(this.props.monthFormat)}
            </Text>
            {indicator}
          </TouchableOpacity>
          {rightArrow}
        </View>
        {!this.props.hideDayNames && (
          <View style={this.style.week}>
            {this.props.weekNumbers && (
              <Text allowFontScaling={false} style={this.style.dayHeader} />
            )}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                accessible={false}
                style={this.style.dayHeader}
                numberOfLines={1}
                importantForAccessibility="no"
              >
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    )
  }
}

export default CalendarHeader
