import { render, screen, fireEvent } from "@testing-library/react";
import RangeModal from "../RangeModal";

describe("RangeModal", () => {
  const mockOnClose = jest.fn();
  const mockOnChange = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    value: 50,
    onChange: mockOnChange,
    minLimit: 0,
    maxLimit: 100,
    step: 1,
    title: "Test Modal",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when isOpen is false", () => {
    render(<RangeModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("renders modal with correct title and value when open", () => {
    render(<RangeModal {...defaultProps} />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(50);
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<RangeModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onChange with new value when form is submitted", () => {
    render(<RangeModal {...defaultProps} />);
    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "75" } });
    fireEvent.click(screen.getByText("Accept"));

    expect(mockOnChange).toHaveBeenCalledWith(75);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("respects min and max limits", () => {
    render(<RangeModal {...defaultProps} />);
    const input = screen.getByRole("spinbutton");

    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });
});
