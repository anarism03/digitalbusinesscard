import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../layout/FrameContainerContext";
import { styles } from "../../styles/shared/RangeCalendarPicker.styles";

const { RangePicker } = DatePicker;

type DraftRange = [Dayjs | null, Dayjs | null] | null;

interface RangeCalendarPickerProps {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
  className: string;
  style: CSSProperties;
}

export default function RangeCalendarPicker({
  from,
  to,
  onChange,
  className,
  style,
}: RangeCalendarPickerProps) {
  const getPopupContainer = useFrameContainer();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftRange>(
    from && to ? [dayjs(from), dayjs(to)] : null,
  );
  const committedValue: DraftRange =
    from && to ? [dayjs(from), dayjs(to)] : null;
  const justPickedFullRangeRef = useRef(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && justPickedFullRangeRef.current) {
      justPickedFullRangeRef.current = false;
      return;
    }
    if (nextOpen) {
      setDraft(committedValue);
    }
    setOpen(nextOpen);
  };

  return (
    <RangePicker
      key={open ? "open" : "closed"}
      {...(open
        ? { defaultValue: committedValue ?? undefined }
        : { value: committedValue })}
      onCalendarChange={(dates) => {
        setDraft(dates ?? null);
        if (dates && dates[0] && dates[1]) {
          justPickedFullRangeRef.current = true;
        }
      }}
      onChange={(dates) => {
        if (!dates) {
          setDraft(null);
          onChange(null, null);
        }
      }}
      format="DD/MM/YYYY"
      size="large"
      allowClear
      placeholder={["Başlama tarixi", "Bitmə tarixi"]}
      suffixIcon={<CalendarOutlined />}
      className={className}
      style={style}
      getPopupContainer={getPopupContainer}
      classNames={{ popup: { root: "cadmin-range-popup" } }}
      open={open}
      onOpenChange={handleOpenChange}
      panelRender={(panel) => (
        <>
          {panel}
          <div style={styles.footer}>
            <Button
              onClick={() => {
                setDraft(null);
                onChange(null, null);
                setOpen(false);
              }}
            >
              Təmizlə
            </Button>
            <Button
              type="primary"
              style={styles.applyButton}
              disabled={!draft?.[0] || !draft[1]}
              onClick={() => {
                if (draft?.[0] && draft[1]) {
                  onChange(
                    draft[0].format("YYYY-MM-DD"),
                    draft[1].format("YYYY-MM-DD"),
                  );
                }
                setOpen(false);
              }}
            >
              Hazır
            </Button>
          </div>
        </>
      )}
    />
  );
}
