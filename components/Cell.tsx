//Created by Kimaya Jadhav

"use client";
import styled from "styled-components";

// Styles the cell with two visual states, revealed (light) and unrevealed (dark)
const StyledCell = styled.div<{ $revealed: boolean }>`
  width: 40px;
  height: 40px;
  border: 1px solid #444;
  
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  cursor: pointer;

  background-color: ${(props) =>
    props.$revealed ? "#ddd" : "#999"};

  &:hover {
    background-color: ${(props) =>
    props.$revealed ? "#ddd" : "#bbb"};
  }
`;

// all state passed down from parent board
type CellProps = {
    isBomb: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacent: number; // number of neighboring bombs (0-8)
    onReveal: () => void;
    onFlag: () => void;
};

export default function Cell({
                                 isBomb,
                                 isRevealed,
                                 isFlagged,
                                 adjacent,
                                 onReveal,
                                 onFlag,
                             }: CellProps) {

    // handles users flagging by right clicking
    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault(); // prevents browser context menu
        if (!isRevealed) {
            onFlag();
        }
    };

    // determines what is displayed in each cell
    const renderContent = () => {
        if (!isRevealed) {
            return isFlagged ? "🚩" : "";
        }

        if (isBomb) return "💣";
        if (adjacent > 0) return adjacent;

        return "";
    };

    return (
        <StyledCell
            onClick={onReveal}
            onContextMenu={handleRightClick}
            $revealed={isRevealed} //changes background color in styled component
        >
            {renderContent()}
        </StyledCell>
    );
}