import { Button, Slider, Space, Tooltip } from "antd";
import {
  CaretRightFilled,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { StepPlayer } from "./useStepPlayer";

interface Props {
  player: StepPlayer;
  /** short human labels for each step, shown under the scrubber */
  stepLabels?: string[];
}

/**
 * Reusable play / pause / step / scrub control bar, driven by useStepPlayer.
 * Shared by every lesson so the interaction model is identical everywhere.
 */
export default function StepControls({ player, stepLabels }: Props) {
  const { t } = useTranslation();
  const {
    step,
    total,
    isPlaying,
    isFirst,
    isLast,
    toggle,
    next,
    prev,
    reset,
    goTo,
  } = player;

  return (
    <div className="rounded-xl border border-border bg-surface/60 px-4 py-3">
      <div className="flex items-center gap-2">
        <Space.Compact>
          <Tooltip title={t("common.prevStep")}>
            <Button
              icon={<StepBackwardOutlined />}
              onClick={prev}
              disabled={isFirst}
            />
          </Tooltip>
          <Tooltip title={isPlaying ? t("common.pause") : t("common.play")}>
            <Button
              type="primary"
              icon={isPlaying ? <PauseOutlined /> : <CaretRightFilled />}
              onClick={toggle}
            >
              {isPlaying
                ? t("common.pause")
                : isLast
                  ? t("common.replay")
                  : t("common.play")}
            </Button>
          </Tooltip>
          <Tooltip title={t("common.nextStep")}>
            <Button
              icon={<StepForwardOutlined />}
              onClick={next}
              disabled={isLast}
            />
          </Tooltip>
        </Space.Compact>

        <Tooltip title={t("common.reset")}>
          <Button icon={<ReloadOutlined />} onClick={reset} />
        </Tooltip>

        <div className="ml-auto text-sm text-muted tabular-nums">
          {t("common.step", { current: step + 1, total })}
        </div>
      </div>

      <div className="mt-2">
        <Slider
          min={0}
          max={total - 1}
          value={step}
          onChange={goTo}
          tooltip={{ open: false }}
        />
        {stepLabels && (
          <div className="min-h-5 text-center text-sm text-brand-2">
            {stepLabels[step]}
          </div>
        )}
      </div>
    </div>
  );
}
