<script>
    import { scaleBand, scaleLinear } from "d3-scale";
    import { line, curveCardinal } from "d3";

    export let datapoints1 = [];
    export let datapoints2 = [];
    export let datapoints3 = [];
    export let datapoints4 = [];
    export let year = "releaseYear";
    export let rating = "count";

    let color1 = "#f986c5"; // Netflix
    let color2 = "#A0C4FF"; // Apple
    let color3 = "#90d5b0"; // Amazon

    const allData = datapoints4;

    let minWidth = 450; // Minimum width to show X labels

    let margins = { left: 60, top: 45, bottom: 55, right: 40 };
    // Update margins if container size is below the minimum
    $: {
        if (containerWidth < minWidth) {
            margins = { left: 26, top: 26, bottom: 26, right: 26 };
        } else {
            margins = { left: 60, top: 45, bottom: 55, right: 40 };
        }
    }

    let container;
    let containerWidth = 0;
    let containerHeight = 0;

    const line_width = 3;

    // Chart dimensions
    $: chartWidth = containerWidth - margins.left - margins.right;
    $: chartHeight = containerHeight - margins.top - margins.bottom;

    // Scales
    $: scaleX = scaleBand()
        .domain(allData.map((d) => parseInt(d[year]))) // Parse years to integers
        .range([0, chartWidth])
        .padding(0.1);

    // Y-axis is fixed to range 5 to 9
    $: scaleY = scaleLinear().domain([0, 4000]).range([chartHeight, 0]);

    $: lineGenerator = line()
        .curve(curveCardinal.tension(0.6))
        .x((d) => scaleX(parseInt(d[year])))
        .y((d) => scaleY(d[rating]))
        .defined(function (d) {
            return d[rating] > 1.0;
        });

    // Tooltip variables
    let tooltipVisible = false;
    let tooltipPosition = { x: 0, y: 0 };
    let tooltipYear = null;
    let tooltipValues = [];
    let verticalLineX = null;

    function handleMouseMove(event) {
        // Get precise mouse position relative to the SVG
        const svgRect = container.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left - margins.left;
        const mouseY = event.clientY - svgRect.top - margins.top;

        // Only process if within chart bounds
        if (
            mouseX < 0 ||
            mouseX > chartWidth ||
            mouseY < 0 ||
            mouseY > chartHeight
        ) {
            tooltipVisible = false;
            return;
        }

        // Calculate band positions
        const years = allData.map((d) => parseInt(d[year]));
        const bandWidth = scaleX.bandwidth();
        const step = chartWidth / years.length;

        // Find closest year index
        const closestIndex = Math.min(
            years.length - 1,
            Math.max(0, Math.floor(mouseX / step)),
        );
        const closestYear = years[closestIndex];

        if (closestYear) {
            verticalLineX = scaleX(closestYear) + bandWidth / 2;
            tooltipYear = closestYear;

            // Get values from all datasets
            tooltipValues = [
                {
                    value: datapoints1.find(
                        (d) => parseInt(d[year]) === closestYear,
                    )?.[rating],
                    color: color1,
                },
                {
                    value: datapoints2.find(
                        (d) => parseInt(d[year]) === closestYear,
                    )?.[rating],
                    color: color2,
                },
                {
                    value: datapoints3.find(
                        (d) => parseInt(d[year]) === closestYear,
                    )?.[rating],
                    color: color3,
                },
            ];

            tooltipValues.sort(
                (a, b) => parseFloat(b.value) - parseFloat(a.value),
            );

            // Update tooltip position
            tooltipPosition = {
                x: event.clientX + 15,
                y: event.clientY - 10,
            };
            tooltipVisible = true;
        }
    }

    function handleMouseLeave() {
        tooltipVisible = false;
        verticalLineX = null;
    }
</script>

<svg
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    bind:this={container}
    style="width: 100%; height: 100%;"
>
    <!-- Chart Group -->
    <g transform={`translate(${margins.left}, ${margins.top})`}>
        <path
            d={lineGenerator(datapoints2)}
            opacity="1.0"
            fill="none"
            stroke={color2}
            stroke-width={line_width}
        />

        <path
            d={lineGenerator(datapoints3)}
            opacity="1.0"
            fill="none"
            stroke={color3}
            stroke-width={line_width}
        />

        <path
            d={lineGenerator(datapoints1)}
            opacity="1.0"
            fill="none"
            stroke={color1}
            stroke-width={line_width}
        />

        <!-- Gray Boy: Covering rectangle that shrinks to reveal the lines -->
        <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight}
            fill="#404040"
            pointer-events="none"
        >
            <animate
                attributeName="x"
                from="0"
                to={chartWidth}
                begin="0.8s"
                dur="1.2s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.39 0.575 0.565 1"
                keyTimes="0;1"
            />
            <animate
                attributeName="width"
                from={chartWidth}
                to="0"
                begin="0.8s"
                dur="1.2s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.39 0.575 0.565 1"
                keyTimes="0;1"
            />
        </rect>

        <!-- Vertical line -->
        <line
            x1={verticalLineX}
            y1={0}
            x2={verticalLineX}
            y2={chartHeight}
            stroke="white"
            stroke-width={1}
            opacity={tooltipVisible ? 0.3 : 0}
            class="vertical-line"
        />

        <!-- X-Axis Labels (Filtered) -->
        {#each allData as datapoint, i}
            {#if i % 10 === 4 && containerWidth >= minWidth}
                <text
                    x={scaleX(parseInt(datapoint[year])) +
                        scaleX.bandwidth() / 2}
                    y={chartHeight + 20}
                    text-anchor="middle"
                    fill="lightgray"
                    font-size="10"
                >
                    {parseInt(datapoint[year])}
                </text>
            {/if}
        {/each}

        <!-- Y-Axis -->
        {#each scaleY.ticks(5) as tick}
            <g transform={`translate(0, ${scaleY(tick)})`}>
                <line
                    x1="0"
                    x2={chartWidth}
                    stroke="gray"
                    stroke-dasharray="2,2"
                    opacity="0.3"
                />
                {#if containerWidth >= minWidth}
                    <text
                        x="-10"
                        y="5"
                        text-anchor="end"
                        fill="lightgray"
                        font-size="10"
                    >
                        {tick}
                    </text>
                {/if}
            </g>
        {/each}

        <!-- Mouse interaction area -->
        <rect
            x={0}
            y={0}
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
            on:mousemove={handleMouseMove}
            on:mouseleave={handleMouseLeave}
        />
    </g>
</svg>

<!-- Tooltip HTML -->
<div
    class="tooltip"
    style:left={`${tooltipPosition.x}px`}
    style:top={`${tooltipPosition.y}px`}
    class:visible={tooltipVisible}
>
    {#if tooltipYear}
        <div class="year">{tooltipYear}</div>
        {#each tooltipValues as item}
            <div class="tooltip-item">
                <span style="color: {item.color}; margin:auto; display:table;">
                    {isNaN(parseFloat(item.value)) || item.value === ""
                        ? "-"
                        : parseFloat(item.value).toFixed(0)}
                </span>
            </div>
        {/each}
    {/if}
</div>

<style>
    text {
        font-family: "Manrope", sans-serif;
        opacity: 0.5;
    }

    .tooltip {
        position: fixed;
        pointer-events: none;
        background: rgba(25, 25, 25, 0.6);
        color: white;
        padding: 8px;
        border-radius: 4px;
        font-family: "Manrope", sans-serif;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 100;
        backdrop-filter: blur(3px);
    }

    .tooltip.visible {
        opacity: 1;
    }

    .year {
        margin-bottom: 4px;
    }

    .tooltip-item {
        display: flex;
        align-items: center;
        font-weight: bold;
        gap: 6px;
        margin: 2px 0;
    }
</style>
