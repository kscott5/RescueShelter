import * as React from "react";
import * as ReactDOM from "react-dom";

import {ChartJS} from "./chartjs";

export function ChartJsReport(props) { 
      return <ChartJS props={props} reportType={props.match.params.reportType||'polarArea'}/>;
}