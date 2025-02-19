<script>
    import { scaleBand, scaleLinear } from "d3-scale";

    export let data = [];
    let color1 = "#f986c5"; // Netflix
    let color2 = "#A0C4FF"; // Apple
    let color3 = "#90d5b0"; // Amazon

    const genresOrder = [
        "Drama",
        "Comedy",
        "Action",
        "Romance",
        "Thriller",
        "Other",
    ];
    let container;
    let containerWidth = 0;
    let containerHeight = 0;

    let minWidth = 450; // Minimum width to show X labels

    let margins = { left: 60, top: 45, bottom: 55, right: 40 };
    // Update margins if container size is below the minimum
    $: {
        if (containerWidth < minWidth) {
            margins = { left: 45, top: 23, bottom: 35, right: 20 };
        } else {
            margins = { left: 60, top: 45, bottom: 55, right: 40 };
        }
    }

    // Process data to include all genres in order with defaults
    $: processedData = genresOrder.map((genre) => {
        const entry = data.find((d) => d.genre === genre) || {
            netflix: 0,
            apple: 0,
            amazon: 0,
        };
        return {
            genre: genre,
            netflix: Math.max(0, Math.min(100, +entry.netflix || 0)),
            apple: Math.max(0, Math.min(100, +entry.apple || 0)),
            amazon: Math.max(0, Math.min(100, +entry.amazon || 0)),
        };
    });

    // Chart dimensions
    $: chartWidth = containerWidth - margins.left - margins.right;
    $: chartHeight = containerHeight - margins.top - margins.bottom;

    // Scales
    $: scaleX = scaleBand()
        .domain(genresOrder)
        .range([0, chartWidth])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    $: scaleSubgroup = scaleBand()
        .domain(["netflix", "apple", "amazon"])
        .range([0, scaleX.bandwidth()])
        .padding(0.2);

    $: maxYValue = Math.max(
        ...processedData.flatMap((d) => [d.netflix, d.apple, d.amazon]),
    );

    $: scaleY = scaleLinear()
        .domain([0, maxYValue])
        .range([chartHeight, 0])
        .nice();

    let tooltipData = {
        show: false,
        x: 0,
        y: 0,
        value: 0,
    };
</script>

<svg
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    bind:this={container}
    style="width: 100%; height: 100%;"
>
    <g transform={`translate(${margins.left}, ${margins.top})`}>
        <!-- Bars -->
        {#each processedData as datapoint}
            {@const x = scaleX(datapoint.genre)}
            <g transform={`translate(${x}, 0)`}>
                <defs>
                    <linearGradient
                        id="opacityGradient1"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stop-color={color1}
                            stop-opacity="1"
                        />
                        <stop
                            offset="100%"
                            stop-color={color1}
                            stop-opacity="0.5"
                        />
                    </linearGradient>
                </defs>

                <defs>
                    <linearGradient
                        id="opacityGradient2"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stop-color={color2}
                            stop-opacity="1"
                        />
                        <stop
                            offset="100%"
                            stop-color={color2}
                            stop-opacity="0.5"
                        />
                    </linearGradient>
                </defs>

                <defs>
                    <linearGradient
                        id="opacityGradient3"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stop-color={color3}
                            stop-opacity="1"
                        />
                        <stop
                            offset="100%"
                            stop-color={color3}
                            stop-opacity="0.5"
                        />
                    </linearGradient>
                </defs>

                <rect
                    x={scaleSubgroup("netflix")}
                    y={scaleY(datapoint.netflix)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.netflix)}
                    fill="url(#opacityGradient1)"
                    rx="5"
                    opacity="0.8"
                    on:mouseover={(e) => {
                        tooltipData = {
                            show: true,
                            x: e.clientX,
                            y: e.clientY,
                            value: datapoint.netflix,
                        };
                    }}
                    on:mousemove={(e) => {
                        tooltipData = {
                            ...tooltipData,
                            x: e.clientX,
                            y: e.clientY,
                        };
                    }}
                    on:mouseout={() => (tooltipData.show = false)}
                />
                <rect
                    x={scaleSubgroup("apple")}
                    y={scaleY(datapoint.apple)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.apple)}
                    fill="url(#opacityGradient2)"
                    rx="5"
                    opacity="0.8"
                    on:mouseover={(e) => {
                        tooltipData = {
                            show: true,
                            x: e.clientX,
                            y: e.clientY,
                            value: datapoint.apple,
                        };
                    }}
                    on:mousemove={(e) => {
                        tooltipData = {
                            ...tooltipData,
                            x: e.clientX,
                            y: e.clientY,
                        };
                    }}
                    on:mouseout={() => (tooltipData.show = false)}
                />
                <rect
                    x={scaleSubgroup("amazon")}
                    y={scaleY(datapoint.amazon)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.amazon)}
                    fill="url(#opacityGradient3)"
                    rx="5"
                    opacity="0.8"
                    on:mouseover={(e) => {
                        tooltipData = {
                            show: true,
                            x: e.clientX,
                            y: e.clientY,
                            value: datapoint.amazon,
                        };
                    }}
                    on:mousemove={(e) => {
                        tooltipData = {
                            ...tooltipData,
                            x: e.clientX,
                            y: e.clientY,
                        };
                    }}
                    on:mouseout={() => (tooltipData.show = false)}
                />
            </g>
        {/each}

        <!-- Gray Boy: Covering rectangle that shrinks to reveal the lines -->
        <defs>
            <filter id="blur-bottom" x="0" y="0" width="100%" height="100%">
                <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="0 8"
                    result="blur"
                />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="1" intercept="0" />
                </feComponentTransfer>
            </filter>
        </defs>
        <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight}
            fill="#404040"
            pointer-events="none"
            filter="url(#blur-bottom)"
        >
            <animate
                attributeName="height"
                from={chartHeight}
                to="0"
                begin="0.7s"
                dur="0.7s"
                fill="freeze"
            />
        </rect>
        <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight / 2}
            fill="#404040"
            pointer-events="none"
        >
            <animate
                attributeName="height"
                from={chartHeight / 2}
                to="0"
                begin="0.7s"
                dur="0.7s"
                fill="freeze"
            />
        </rect>

        <!-- X Axis Labels -->
        {#each processedData as datapoint}
            <text
                x={scaleX(datapoint.genre) + scaleX.bandwidth() / 2}
                y={chartHeight + 20}
                text-anchor="middle"
                fill="white"
                font-weight="bold"
                font-size="10"
            >
                {datapoint.genre}
            </text>
        {/each}

        <!-- Y Axis -->
        {#each scaleY.ticks(5) as tick}
            <g transform={`translate(0, ${scaleY(tick)})`}>
                <line
                    x1="0"
                    x2={chartWidth}
                    stroke="gray"
                    stroke-dasharray="2,2"
                    opacity="0.3"
                />
                <text
                    x="-10"
                    y="5"
                    text-anchor="end"
                    fill="lightgray"
                    font-size="10"
                >
                    {tick}%
                </text>
            </g>
        {/each}

        <!-- Axis Labels -->
        <text
            x={chartWidth / 2}
            y={chartHeight + margins.bottom - 10}
            text-anchor="middle"
            fill="lightgray"
            font-size="12"
        >
        </text>
        <text
            transform="rotate(-90)"
            y="-40"
            x={-chartHeight / 2}
            text-anchor="middle"
            fill="lightgray"
            font-size="12"
        >
        </text>
    </g>
</svg>

{#if tooltipData.show}
    <div
        class="tooltip"
        style="left: {tooltipData.x + 10}px; 
                top: {tooltipData.y - 15}px;"
    >
        {tooltipData.value.toFixed(1)}%
    </div>
{/if}

<style>
    text {
        font-family: "Manrope", sans-serif;
        opacity: 0.5;
    }

    .tooltip {
        position: fixed;
        background: rgba(25, 25, 25, 0.6);
        color: white;
        padding: 8px;
        border-radius: 4px;
        pointer-events: none;
        font-size: 12px;
        font-weight: bold;
        font-family: "Manrope", sans-serif;
        z-index: 100;
        backdrop-filter: blur(3px);
    }
</style>
