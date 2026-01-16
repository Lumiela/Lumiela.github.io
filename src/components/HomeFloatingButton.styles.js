import styled from 'styled-components';

export const FloatingButton = styled.button`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1010;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.7); /* Transparent white */
  backdrop-filter: blur(5px); /* Blur effect */
  color: #333; /* Darker text for contrast */
  border: 2px solid rgba(0, 0, 0, 0.1); /* More prominent border */
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Lighter shadow */
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9); /* More opaque on hover */
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  /* Desktop styles (1024px and up) */
  @media (min-width: 1024px) {
    width: 90px;
    height: 90px;
    bottom: 70px;
    right: 30px;
    font-size: 0.9em;
  }

  /* Mobile styles (1023px and below) */
  @media (max-width: 1023px) {
    width: 60px;
    height: 60px;
    bottom: 70px; /* Positioned lower on mobile */
    right: 15px;
    font-size: 0.75em;
  }
`;

export const Icon = styled.span`
  line-height: 1.2;

  @media (min-width: 1024px) {
    font-size: 1.4em;
    margin-bottom: 2px;
  }

  @media (max-width: 1023px) {
    font-size: 1.1em;
    margin-bottom: 2px;
  }
`;

export const ButtonText = styled.span`
  line-height: 1.2;
`;
