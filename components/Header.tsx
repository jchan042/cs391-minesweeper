import styled from "styled-components";
// need to style
// need to add log in log out
    // log in log out needs button styling
// need to add user name when logged in

const StyledHeader = styled.header`
    background-color: #555;
    color: black;
    padding: 16px;
    text-align: center;

    h1 {
        font-size: calc(1.5rem + 1vw);
        margin: 0;
    }

    p {
        font-size: calc(0.8rem + 0.3vw);
        margin: 5px 0 0 0;
        opacity: 0.85;
    }

    @media screen and (max-width: 750px) {
        text-align: center;
    }
`;

export default function Header() {
    return (
        <StyledHeader>
            <h1>Minesweeper</h1>
        </StyledHeader>
    );
}