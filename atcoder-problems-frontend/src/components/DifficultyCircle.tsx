import React from "react";
import { Badge, Tooltip } from "reactstrap";
import { getRatingColor, getRatingColorCode } from "../utils";

interface Props {
  id: string;
  difficulty: number | null;
}

interface LocalState {
  tooltipOpen: boolean;
}

function getColor(difficulty: number): string {
  if (difficulty >= 3200) {
    if (difficulty < 3600) {
      // bronze
      return "#965C2C";
    } else if (difficulty < 4000) {
      // silver
      return "#808080";
    } else {
      // gold
      return "#ffd700";
    }
  } else {
    return getRatingColorCode(getRatingColor(difficulty));
  }
}

export class DifficultyCircle extends React.Component<Props, LocalState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
  }

  render(): React.ReactNode {
    const { id, difficulty } = this.props;
    const { tooltipOpen } = this.state;
    const toggleTooltipState = (): void =>
      this.setState({ tooltipOpen: !tooltipOpen });
    const circleId = "DifficultyCircle-" + id;
    if (difficulty === null) {
      return (
        <span>
          <Badge
            className="difficulty-unavailable-circle"
            color="info"
            id={circleId}
            pill
          >
            ?
          </Badge>
          <Tooltip
            placement="top"
            target={circleId}
            isOpen={tooltipOpen}
            toggle={toggleTooltipState}
          >
            Difficulty is unavailable.
          </Tooltip>
        </span>
      );
    }
    const fillRatio: number =
      difficulty >= 3200 ? 1.0 : (difficulty % 400) / 400;
    const color: string = getColor(difficulty);
    const r: number = parseInt(color.slice(1, 3), 16);
    const g: number = parseInt(color.slice(3, 5), 16);
    const b: number = parseInt(color.slice(5, 7), 16);
    const styleOptions = Object({
      borderColor: color,
      background:
        difficulty < 3200
          ? `linear-gradient(to top, rgba(${r}, ${g}, ${b}, ${1.0}) 0%, rgba(${r}, ${g}, ${b}, ${1.0}) ${
              fillRatio * 100
            }%, rgba(${r}, ${g}, ${b}, ${0.0}) ${
              fillRatio * 100
            }%, rgba(${r}, ${g}, ${b}, ${0.0}) 100%)`
          : difficulty < 3600
          ? `linear-gradient(to right, ${color}, #FFDABD, ${color})`
          : `linear-gradient(to right, ${color}, white, ${color})`,
    });
    const title = `Difficulty: ${difficulty}`;
    return (
      <>
        <span
          className="difficulty-circle"
          style={styleOptions}
          id={circleId}
        />
        <Tooltip
          placement="top"
          target={circleId}
          isOpen={tooltipOpen}
          toggle={toggleTooltipState}
        >
          {title}
        </Tooltip>
      </>
    );
  }
}
