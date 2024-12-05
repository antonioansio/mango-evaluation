"use client";
import React, { useState, useRef, useEffect } from "react";
import RangeModal from "./RangeModal";
import { RangeProps, ModalConfig } from "@/types/range";

const Range: React.FC<RangeProps> = ({
  minLimit,
  maxLimit,
  predefinedSteps,
  step,
  onChangeRange,
  initialMin,
  initialMax,
  disableModal = false,
}) => {
  const [minValue, setMinValue] = useState(initialMin ?? minLimit);
  const [maxValue, setMaxValue] = useState(initialMax ?? maxLimit);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const snapToValue = (value: number): number => {
    if (predefinedSteps) {
      return predefinedSteps.reduce((prev, curr) => {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
      });
    }
    const stepValue = step ?? 0.01;
    return Math.round(value / stepValue) * stepValue;
  };

  const updateValue = (clientX: number, thumb: "min" | "max") => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const rawValue = minLimit + (maxLimit - minLimit) * percentage;
    const snappedValue = snapToValue(rawValue);

    if (thumb === "min") {
      const minMargin = step ?? 0.01;
      const newMin = Math.min(
        maxValue - minMargin,
        Math.max(minLimit, snappedValue)
      );
      if (newMin !== minValue) {
        setMinValue(newMin);
        onChangeRange?.(newMin, maxValue);
      }
    } else {
      const minMargin = step ?? 0.01;
      const newMax = Math.max(
        minValue + minMargin,
        Math.min(maxLimit, snappedValue)
      );
      if (newMax !== maxValue) {
        setMaxValue(newMax);
        onChangeRange?.(minValue, newMax);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent, thumb: "min" | "max") => {
    setIsDragging(thumb);
    updateValue(e.clientX, thumb);
  };

  const handleTouchStart = (e: React.TouchEvent, thumb: "min" | "max") => {
    setIsDragging(thumb);
    updateValue(e.touches[0].clientX, thumb);
  };

  const handleBarClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const clickedValue = minLimit + (maxLimit - minLimit) * percentage;

    const distanceToMin = Math.abs(clickedValue - minValue);
    const distanceToMax = Math.abs(clickedValue - maxValue);

    if (distanceToMin <= distanceToMax) {
      updateValue(e.clientX, "min");
    } else {
      updateValue(e.clientX, "max");
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateValue(e.clientX, isDragging);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      updateValue(e.touches[0].clientX, isDragging);
    };

    const handleEnd = () => {
      setIsDragging(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, minLimit, maxLimit, predefinedSteps]);

  const minPercentage = ((minValue - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercentage = ((maxValue - minLimit) / (maxLimit - minLimit)) * 100;

  const handleValueClick = (type: "min" | "max") => {
    if (disableModal) return;

    const minMargin = step ?? 0.01;
    const config: ModalConfig =
      type === "min"
        ? {
            value: minValue,
            minLimit: minLimit,
            maxLimit: maxValue - minMargin,
            onChange: (value) => {
              const newMin = Math.min(
                maxValue - minMargin,
                Math.max(minLimit, value)
              );
              setMinValue(newMin);
              onChangeRange?.(newMin, maxValue);
            },
            title: "Min value",
          }
        : {
            value: maxValue,
            minLimit: minValue + minMargin,
            maxLimit: maxLimit,
            onChange: (value) => {
              const newMax = Math.max(
                minValue + minMargin,
                Math.min(maxLimit, value)
              );
              setMaxValue(newMax);
              onChangeRange?.(minValue, newMax);
            },
            title: "Max value",
          };

    setModalConfig(config);
  };

  return (
    <div className="relative w-full pt-2 pb-8">
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onClick={handleBarClick}
      >
        {/* Bar */}
        <div
          className="absolute h-full bg-black rounded-full"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />
        {/* Min thumb */}
        <div
          className={`absolute top-1/2 w-4 h-4 bg-black rounded-full -mt-2 -ml-2 cursor-grab
            transition-transform duration-200 hover:scale-125
            ${isDragging === "min" ? "cursor-grabbing" : ""}`}
          style={{ left: `${minPercentage}%` }}
          onMouseDown={(e) => handleMouseDown(e, "min")}
          onTouchStart={(e) => handleTouchStart(e, "min")}
        />
        {/* Max thumb */}
        <div
          className={`absolute top-1/2 w-4 h-4 bg-black rounded-full -mt-2 -ml-2 cursor-grab
            transition-transform duration-200 hover:scale-125
            ${isDragging === "max" ? "cursor-grabbing" : ""}`}
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={(e) => handleMouseDown(e, "max")}
          onTouchStart={(e) => handleTouchStart(e, "max")}
        />
      </div>
      <div className="absolute top-8 left-0 right-0 flex justify-between text-sm text-gray-600">
        <span
          className="bg-gray-100 p-1 rounded-md font-bold cursor-pointer hover:bg-gray-200"
          onClick={() => handleValueClick("min")}
        >
          {Number.isFinite(minValue) ? `${minValue.toFixed(2)}€` : ""}
        </span>
        <span
          className="bg-gray-100 p-1 rounded-md font-bold cursor-pointer hover:bg-gray-200"
          onClick={() => handleValueClick("max")}
        >
          {Number.isFinite(maxValue) ? `${maxValue.toFixed(2)}€` : ""}
        </span>
      </div>

      {/* Modal */}
      <RangeModal
        isOpen={modalConfig !== null}
        onClose={() => setModalConfig(null)}
        value={modalConfig?.value ?? minLimit}
        onChange={modalConfig?.onChange ?? (() => {})}
        minLimit={modalConfig?.minLimit ?? minLimit}
        maxLimit={modalConfig?.maxLimit ?? maxLimit}
        step={predefinedSteps?.[0] ?? step ?? 0.01}
        title={modalConfig?.title ?? ""}
      />
    </div>
  );
};

export default Range;
