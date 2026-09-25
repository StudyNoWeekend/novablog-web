/**
 * 主题手绘涂鸦集：全部为内联 SVG，墨线 + 漫画黄的扁平手绘风。
 * 仅作装饰（aria-hidden），不承载数据语义。
 */

/** 极简猫头 logo（页头 / 页脚 / 空状态通用） */
export function CatFace({
  className = "h-7 w-7",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* 耳朵 */}
      <path
        d="M10 18 L7 7 L18 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 18 L41 7 L30 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 脸 */}
      <path
        d="M8 24c0-8 7-14 16-14s16 6 16 14c0 9-7 15-16 15S8 33 8 24Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 眼睛 */}
      <circle cx="17.5" cy="24" r="1.9" fill="currentColor" />
      <circle cx="30.5" cy="24" r="1.9" fill="currentColor" />
      {/* 鼻子 */}
      <path
        d="M22.6 29.4h2.8l-1.4 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* 胡须 */}
      <path
        d="M5 27h7M6.5 31.5l5.5-1.5M43 27h-7M41.5 31.5l-5.5-1.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 黄色皇冠涂鸦 */
export function CrownDoodle({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 26 3.5 9l9 6.5L20 4l7.5 11.5 9-6.5L35 26Z"
        fill="var(--color-accent)"
        stroke="var(--color-ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 30h24" stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** 四角星光涂鸦 */
export function Sparkle({
  className = "h-4 w-4",
  color = "var(--color-accent)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 2c.8 5.5 2.7 8.2 10 10-7.3 1.8-9.2 4.5-10 10-.8-5.5-2.7-8.2-10-10 7.3-1.8 9.2-4.5 10-10Z"
        fill={color}
      />
    </svg>
  );
}

/** 小爪印 */
export function PawPrint({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <ellipse cx="7" cy="7.5" rx="2.4" ry="3.1" fill="currentColor" />
      <ellipse cx="17" cy="7.5" rx="2.4" ry="3.1" fill="currentColor" />
      <ellipse cx="2.9" cy="13" rx="2.1" ry="2.7" fill="currentColor" />
      <ellipse cx="21.1" cy="13" rx="2.1" ry="2.7" fill="currentColor" />
      <path
        d="M12 11.5c3.6 0 6.5 2.8 6.5 5.9 0 2.4-1.9 4-4.3 4-1 0-1.6-.3-2.2-.3s-1.2.3-2.2.3c-2.4 0-4.3-1.6-4.3-4 0-3.1 2.9-5.9 6.5-5.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 举爪小猫（关于我卡片装饰） */
export function ChibiCat({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      {/* 举起的爪子 */}
      <path
        d="M86 52c6-8 7-16 5-22"
        stroke="var(--color-ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="90" cy="26" r="6" fill="var(--color-ink)" />
      <circle cx="98" cy="30" r="5" fill="var(--color-ink)" />
      {/* 身体 */}
      <path
        d="M32 108c0-24 8-42 30-42s30 18 30 42Z"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 头 */}
      <circle cx="60" cy="44" r="24" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="4" />
      <path d="M42 28 39 15l13 7" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="var(--color-surface)" />
      <path d="M78 28 81 15l-13 7" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="var(--color-surface)" />
      {/* 表情（弯眼笑） */}
      <path d="M49 44c1.6-2.6 5.4-2.6 7 0" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M66 44c1.6-2.6 5.4-2.6 7 0" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M56 53c2.4 2.2 7.6 2.2 10 0" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      {/* 腮红 */}
      <circle cx="44" cy="51" r="3.4" fill="var(--color-tomato-subtle)" />
      <circle cx="76" cy="51" r="3.4" fill="var(--color-tomato-subtle)" />
      {/* 爱心 */}
      <path
        d="M22 22c-3-4-9-1.6-8 3 .8 3.6 5 6 8 8 3-2 7.2-4.4 8-8 1-4.6-5-7-8-3Z"
        fill="var(--color-tomato)"
      />
      <path
        d="M100 62c-2-2.7-6-1-5.4 2 .6 2.4 3.4 4 5.4 5.4 2-1.4 4.8-3 5.4-5.4.7-3-3.4-4.7-5.4-2Z"
        fill="var(--color-accent)"
      />
    </svg>
  );
}

/** 主视觉：漫画桌场景（画架 + 涂鸦 + 睡着的猫 + 饮料），呼应“画下想象中的世界” */
export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 440"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern id="halftone-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2.4" cy="2.4" r="1.8" fill="var(--color-border-strong)" />
        </pattern>
      </defs>

      {/* 网点背景块 */}
      <rect x="300" y="36" width="228" height="310" rx="24" fill="url(#halftone-dots)" opacity="0.55" />

      {/* 对话气泡：画下，想象中的世界 */}
      <g>
        <rect x="322" y="44" width="206" height="92" rx="20" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="3" />
        <path d="M360 134l-12 22 34-20Z" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M356 132.5 346 152l28-17Z" fill="var(--color-surface)" />
        <text x="352" y="82" fontSize="24" fill="var(--color-ink)" style={{ fontFamily: "var(--font-display)" }}>
          画下，
        </text>
        <text x="352" y="114" fontSize="24" fill="var(--color-ink)" style={{ fontFamily: "var(--font-display)" }}>
          想象中的世界
        </text>
        <circle cx="516" cy="56" r="4" fill="var(--color-accent)" />
      </g>

      {/* 皇冠 */}
      <g transform="translate(52 58)">
        <path
          d="M6 30 4 8l14 10L28 2l10 16 14-10-2 22Z"
          fill="var(--color-accent)"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 36h38" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 画架 + 画布 */}
      <g transform="rotate(-2 445 250)">
        <path d="M445 168v230" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round" />
        <path d="M380 420l60-160M515 420l-60-160" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round" />
        <rect x="362" y="168" width="170" height="130" rx="10" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="4" />
        {/* 画布上的简笔画：山与太阳 */}
        <circle cx="412" cy="206" r="12" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="2.6" />
        <path d="M378 274l30-34 18 20 16-16 30 30" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M378 282h140" stroke="var(--color-accent)" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 10" />
      </g>

      {/* 桌面 */}
      <rect x="30" y="386" width="500" height="14" rx="7" fill="var(--color-ink)" />

      {/* 纸张 */}
      <g transform="rotate(-6 130 376)">
        <rect x="96" y="356" width="64" height="30" rx="4" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2.6" />
        <path d="M104 366h48M104 374h34" stroke="var(--color-border-strong)" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g transform="rotate(4 210 372)">
        <rect x="180" y="352" width="58" height="34" rx="4" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2.6" />
        <path d="M188 362h42M188 370h28" stroke="var(--color-border-strong)" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* 笔筒 */}
      <g>
        <path d="M92 330v-64M108 330v-72M124 330v-58" stroke="var(--color-ink)" strokeWidth="4.4" strokeLinecap="round" />
        <path d="M92 266v-14l-7-10M108 258v-16l8-8" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="84" cy="240" r="4" fill="var(--color-tomato)" />
        <circle cx="117" cy="232" r="4" fill="var(--color-accent)" />
        <path d="M80 330h60l-6 52H86Z" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="3.4" strokeLinejoin="round" />
        <path d="M92 344l-3 26M110 344l3 26" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* 猫爪杯 */}
      <g>
        <rect x="176" y="336" width="46" height="50" rx="8" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="3.4" />
        <path d="M222 348h10a9 9 0 0 1 0 22h-10" stroke="var(--color-ink)" strokeWidth="3.4" />
        <circle cx="192" cy="356" r="2.2" fill="var(--color-ink)" />
        <circle cx="206" cy="356" r="2.2" fill="var(--color-ink)" />
        <path d="M195 364c1.8 2 6.2 2 8 0" stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M186 350c-4-4-1-9 3-8M212 350c4-4 1-9-3-8" stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M184 330c0-6 8-6 8-12M204 330c0-6 8-6 8-12" stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 睡着的猫 */}
      <g>
        <path
          d="M258 386c-4-22 10-40 34-40 22 0 36 14 36 34 0 4-2 6-6 6Z"
          fill="var(--color-ink)"
        />
        <circle cx="322" cy="360" r="17" fill="var(--color-ink)" />
        <path d="M310 348l-4-10 10 4Z" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M332 346l6-9 3 11Z" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
        {/* 闭眼 */}
        <path d="M314 362c1.6 1.6 4.4 1.6 6 0M326 362c1.6 1.6 4.4 1.6 6 0" stroke="var(--color-surface)" strokeWidth="2" strokeLinecap="round" />
        {/* 尾巴 */}
        <path d="M262 382c-10-2-14-10-10-18" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round" />
        {/* 条纹 */}
        <path d="M282 352c2 6 2 12 0 18M294 348c2.6 7.4 2.6 15 0 22" stroke="var(--color-surface)" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
        {/* zzz */}
        <text x="336" y="330" fontSize="17" fill="var(--color-text-muted)" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
          z
        </text>
        <text x="348" y="316" fontSize="21" fill="var(--color-text-muted)" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
          z
        </text>
        <text x="362" y="300" fontSize="25" fill="var(--color-text-subtle)" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
          z
        </text>
      </g>

      {/* 星光点缀 */}
      <path d="M64 168c.9 6.2 3 9.3 11.4 11.4C67 181.5 64.9 184.6 64 190.8c-.9-6.2-3-9.3-11.4-11.4C61 177.3 63.1 174.2 64 168Z" fill="var(--color-accent)" />
      <path d="M544 178c.7 4.6 2.2 7 8.6 8.6-6.4 1.6-7.9 4-8.6 8.6-.7-4.6-2.2-7-8.6-8.6 6.4-1.6 7.9-4 8.6-8.6Z" fill="var(--color-tomato)" />
      <path d="M310 128c.7 4.6 2.2 7 8.6 8.6-6.4 1.6-7.9 4-8.6 8.6-.7-4.6-2.2-7-8.6-8.6 6.4-1.6 7.9-4 8.6-8.6Z" fill="var(--color-accent)" />
    </svg>
  );
}

/** 日落天台横幅（告别卡）：下一页，我们在漫画里再见（宽幅 1200x280 构图） */
export function SunsetScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 280"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="sunset-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbe3a2" />
          <stop offset="46%" stopColor="#f5b26b" />
          <stop offset="100%" stopColor="#c96f6a" />
        </linearGradient>
      </defs>

      {/* 天空 */}
      <rect width="1200" height="280" fill="url(#sunset-sky)" />

      {/* 落日 */}
      <circle cx="770" cy="182" r="42" fill="#fde68a" />
      <circle cx="770" cy="182" r="58" fill="#fde68a" opacity="0.35" />

      {/* 云 */}
      <g fill="#ffffff" opacity="0.75">
        <ellipse cx="150" cy="66" rx="40" ry="11" />
        <ellipse cx="180" cy="54" rx="26" ry="9" />
        <ellipse cx="470" cy="44" rx="34" ry="10" />
        <ellipse cx="1020" cy="58" rx="38" ry="10" />
        <ellipse cx="1052" cy="70" rx="24" ry="8" />
      </g>

      {/* 飞鸟 */}
      <path d="M330 96c3-3 6-3 9 0M339 96c3-3 6-3 9 0" stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      <path d="M620 74c2.4-2.4 4.8-2.4 7.2 0M627.2 74c2.4-2.4 4.8-2.4 7.2 0" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M940 110c2.4-2.4 4.8-2.4 7.2 0M947.2 110c2.4-2.4 4.8-2.4 7.2 0" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />

      {/* 远处城市剪影 */}
      <g fill="var(--color-ink)" opacity="0.82">
        <rect x="0" y="216" width="88" height="64" />
        <rect x="88" y="234" width="58" height="46" />
        <rect x="146" y="222" width="66" height="58" />
        <rect x="212" y="242" width="50" height="38" />
        <rect x="262" y="228" width="62" height="52" />
        <rect x="324" y="246" width="46" height="34" />
        <rect x="370" y="232" width="70" height="48" />
        <rect x="440" y="240" width="54" height="40" />
        <rect x="494" y="224" width="64" height="56" />
        <rect x="558" y="244" width="52" height="36" />
        <rect x="610" y="230" width="60" height="50" />
        <rect x="670" y="248" width="48" height="32" />
        <rect x="718" y="226" width="64" height="54" />
        <rect x="782" y="238" width="56" height="42" />
        <rect x="838" y="222" width="70" height="58" />
        <rect x="908" y="240" width="56" height="40" />
        <rect x="964" y="230" width="66" height="50" />
        <rect x="1030" y="246" width="50" height="34" />
        <rect x="1080" y="224" width="62" height="56" />
        <rect x="1142" y="238" width="58" height="42" />
        <path d="M28 216v-18l10-10 10 10v18Z" />
        <path d="M166 222v-14l9-9 9 9v14Z" />
        <path d="M520 224v-16l10-10 10 10v16Z" />
        <path d="M862 222v-14l9-9 9 9v14Z" />
        <path d="M1100 224v-18l10-10 10 10v18Z" />
      </g>
      {/* 亮窗 */}
      <g fill="#fde68a" opacity="0.9">
        <rect x="20" y="230" width="7" height="9" />
        <rect x="48" y="246" width="7" height="9" />
        <rect x="170" y="238" width="7" height="9" />
        <rect x="192" y="256" width="7" height="9" />
        <rect x="284" y="242" width="7" height="9" />
        <rect x="392" y="248" width="7" height="9" />
        <rect x="516" y="240" width="7" height="9" />
        <rect x="632" y="246" width="7" height="9" />
        <rect x="740" y="242" width="7" height="9" />
        <rect x="860" y="238" width="7" height="9" />
        <rect x="986" y="246" width="7" height="9" />
        <rect x="1104" y="240" width="7" height="9" />
        <rect x="1160" y="254" width="7" height="9" />
      </g>

      {/* 天台栏杆 + 背影少女（右侧） */}
      <g>
        <rect x="620" y="170" width="560" height="6" rx="3" fill="var(--color-ink)" />
        <rect x="636" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="696" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="756" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="816" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="876" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="936" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="996" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="1056" y="180" width="5" height="44" fill="var(--color-ink)" />
        <rect x="1116" y="180" width="5" height="44" fill="var(--color-ink)" />
        {/* 人物背影：丸子头 + 双肩包 */}
        <circle cx="880" cy="112" r="19" fill="var(--color-ink)" />
        <circle cx="896" cy="92" r="9" fill="var(--color-ink)" />
        <path d="M854 224c0-28 10-48 26-48s26 20 26 48Z" fill="var(--color-ink)" />
        <rect x="858" y="146" width="17" height="44" rx="8.5" fill="var(--color-ink)" opacity="0.92" />
        <rect x="878" y="146" width="17" height="44" rx="8.5" fill="var(--color-ink)" opacity="0.92" />
      </g>
    </svg>
  );
}
