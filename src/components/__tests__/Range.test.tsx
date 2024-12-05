import { render, screen, fireEvent } from "@testing-library/react";
import Range from "../Range";

describe("Range", () => {
  const defaultProps = {
    minLimit: 1.99,
    maxLimit: 70.99,
    step: 0.01,
    initialMin: 5.99,
    initialMax: 70.99,
    onChangeRange: jest.fn(),
  };

  const getMinValueElement = () => {
    const values = screen.getAllByText(/\d+\.\d{2}€/);
    return values[0];
  };

  const getMaxValueElement = () => {
    const values = screen.getAllByText(/\d+\.\d{2}€/);
    return values[1];
  };

  const getSliderBar = () => {
    return document.querySelector(
      ".relative.h-2.bg-gray-200.rounded-full.cursor-pointer"
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with initial values", () => {
    render(<Range {...defaultProps} />);

    expect(getMinValueElement()).toHaveTextContent("5.99€");
    expect(getMaxValueElement()).toHaveTextContent("70.99€");
  });

  it("renders with default values when no initials provided", () => {
    const propsWithoutInitials = {
      ...defaultProps,
      initialMin: undefined,
      initialMax: undefined,
    };
    render(<Range {...propsWithoutInitials} />);

    expect(getMinValueElement()).toHaveTextContent("1.99€");
    expect(getMaxValueElement()).toHaveTextContent("70.99€");
  });

  it("renders with predefined steps", () => {
    const propsWithSteps = {
      ...defaultProps,
      predefinedSteps: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
      initialMin: 5.99,
      initialMax: 70.99,
    };
    render(<Range {...propsWithSteps} />);

    expect(getMinValueElement()).toHaveTextContent("5.99€");
    expect(getMaxValueElement()).toHaveTextContent("70.99€");
  });

  it("handles bar clicks", () => {
    const onChangeRange = jest.fn();
    const propsWithSteps = {
      ...defaultProps,
      predefinedSteps: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
      initialMin: 5.99,
      initialMax: 70.99,
      onChangeRange,
    };
    render(<Range {...propsWithSteps} />);

    const sliderBar = getSliderBar();
    expect(sliderBar).not.toBeNull();

    if (sliderBar) {
      fireEvent.click(sliderBar, {
        clientX: 0,
      });

      expect(onChangeRange).toHaveBeenCalled();
    }
  });

  it("disables modal when disableModal prop is true", () => {
    render(<Range {...defaultProps} disableModal={true} />);

    fireEvent.click(getMinValueElement());
    expect(screen.queryByText("Min value")).not.toBeInTheDocument();
  });

  it("opens modal when clicking on values (if modal not disabled)", () => {
    render(<Range {...defaultProps} />);

    fireEvent.click(getMinValueElement());
    expect(screen.getByText("Min value")).toBeInTheDocument();
  });
});
