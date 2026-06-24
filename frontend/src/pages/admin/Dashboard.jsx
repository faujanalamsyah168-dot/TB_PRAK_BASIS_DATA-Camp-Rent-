import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { ClipboardList, Package, PieChart } from 'lucide-react';
import { api } from '../../api/client';

const INITIAL_CHART_DATA = {
  dayLabels: [],
  paidRevenue: [],
  statusLabels: [],
  statusValues: [],
  statusPercentages: [],
  topItemsLabels: [],
  topItemsValues: [],
  topItemsPercentages: [],
  topPackagesLabels: [],
  topPackagesValues: [],
  topPackagesPercentages: []
};

const INITIAL_TOTALS = {
  range_paid_revenue: 0,
  total_bookings: 0,
  top_item_units: 0,
  top_package_units: 0
};

const STATUS_COLORS = {
  'Menunggu Konfirmasi': '#F59E0B',
  Disetujui: '#3B82F6',
  'Sedang Disewa': '#8B5CF6',
  'Selesai / Dikembalikan': '#10B981',
  Dibatalkan: '#EF4444'
};

const PACKAGE_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#22C55E',
  '#F59E0B',
  '#06B6D4'
];

const PACKAGE_HOVER_COLORS = [
  '#60A5FA',
  '#A78BFA',
  '#4ADE80',
  '#FBBF24',
  '#22D3EE'
];

const toNumber = (value) => Number(value) || 0;

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(toNumber(value));

const formatCompactRupiah = (value) =>
  `Rp ${new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(toNumber(value))}`;

const formatChartDate = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [totals, setTotals] = useState(INITIAL_TOTALS);
  const [chartData, setChartData] = useState(
    INITIAL_CHART_DATA
  );
  const [loading, setLoading] = useState(true);
  const [trendPeriodLabel, setTrendPeriodLabel] = useState(
    '7 hari terakhir'
  );

  const revenueChartRef = useRef(null);
  const packageChartRef = useRef(null);
  const itemChartRef = useRef(null);
  const charts = useRef([]);
  const hasLoadedRef = useRef(false);

  /*
   * Seluruh angka dashboard diambil dari endpoint SQL.
   * Frontend hanya mengubah bentuk response menjadi data Chart.js.
   */
  useEffect(() => {
    let ignoreResponse = false;

    const fetchDashboardData = async () => {
      if (!hasLoadedRef.current) {
        setLoading(true);
      }

      try {
        const dashboardData = await api.get(
          '/dashboard/overview'
        );

        if (ignoreResponse) {
          return;
        }

        const backendFilters =
          dashboardData?.filters &&
          typeof dashboardData.filters === 'object'
            ? dashboardData.filters
            : {};

        const revenueTrendFilter =
          backendFilters.revenue_trend &&
          typeof backendFilters.revenue_trend === 'object'
            ? backendFilters.revenue_trend
            : {};

        setTrendPeriodLabel(
          revenueTrendFilter.description ||
            '7 hari terakhir'
        );

        const backendStats =
          dashboardData?.stats &&
          typeof dashboardData.stats === 'object'
            ? dashboardData.stats
            : {};

        const backendTotals =
          dashboardData?.totals &&
          typeof dashboardData.totals === 'object'
            ? dashboardData.totals
            : INITIAL_TOTALS;

        const revenueTrend = Array.isArray(
          dashboardData?.revenue_trend
        )
          ? dashboardData.revenue_trend
          : [];

        const bookingStatus = Array.isArray(
          dashboardData?.booking_status
        )
          ? dashboardData.booking_status
          : [];

        const topItems = Array.isArray(
          dashboardData?.top_items
        )
          ? dashboardData.top_items
          : [];

        const topPackages = Array.isArray(
          dashboardData?.top_packages
        )
          ? dashboardData.top_packages
          : [];

        setStats({
          total_paid_revenue: toNumber(
            backendStats.total_paid_revenue
          ),
          total_boxing: toNumber(
            backendStats.total_boxing ??
              backendStats.total_paid_bookings
          ),
          total_equipment: toNumber(
            backendStats.total_equipment
          ),
          total_packages: toNumber(
            backendStats.total_packages
          ),
          total_bookings: toNumber(
            backendStats.total_bookings
          ),
          bookings_pending: toNumber(
            backendStats.bookings_pending
          ),
          bookings_approved: toNumber(
            backendStats.bookings_approved
          ),
          bookings_rented: toNumber(
            backendStats.bookings_rented
          ),
          bookings_returned: toNumber(
            backendStats.bookings_returned
          ),
          bookings_cancelled: toNumber(
            backendStats.bookings_cancelled
          )
        });

        setTotals({
          range_paid_revenue: toNumber(
            backendTotals.range_paid_revenue
          ),
          total_bookings: toNumber(
            backendTotals.total_bookings
          ),
          top_item_units: toNumber(
            backendTotals.top_item_units
          ),
          top_package_units: toNumber(
            backendTotals.top_package_units
          )
        });

        setChartData({
          dayLabels: revenueTrend.map((row) =>
            formatChartDate(row.date)
          ),
          paidRevenue: revenueTrend.map((row) =>
            toNumber(row.paid_revenue)
          ),
          statusLabels: bookingStatus.map(
            (row) => row.label
          ),
          statusValues: bookingStatus.map((row) =>
            toNumber(row.value)
          ),
          statusPercentages: bookingStatus.map(
            (row) => toNumber(row.percentage)
          ),
          topItemsLabels: topItems.map(
            (row) => row.name
          ),
          topItemsValues: topItems.map((row) =>
            toNumber(row.value)
          ),
          topItemsPercentages: topItems.map(
            (row) => toNumber(row.percentage)
          ),
          topPackagesLabels: topPackages.map(
            (row) => row.name
          ),
          topPackagesValues: topPackages.map(
            (row) => toNumber(row.value)
          ),
          topPackagesPercentages: topPackages.map(
            (row) => toNumber(row.percentage)
          )
        });

        hasLoadedRef.current = true;
      } catch (error) {
        console.error(
          'Gagal memuat data dashboard dari SQL:',
          error
        );

        if (!ignoreResponse) {
          setStats({
            total_paid_revenue: 0,
            total_boxing: 0,
            total_equipment: 0,
            total_packages: 0,
            total_bookings: 0,
            bookings_pending: 0,
            bookings_approved: 0,
            bookings_rented: 0,
            bookings_returned: 0,
            bookings_cancelled: 0
          });
          setTotals(INITIAL_TOTALS);
          setChartData(INITIAL_CHART_DATA);
        }
      } finally {
        if (!ignoreResponse) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      ignoreResponse = true;
    };
  }, []);

  const displayedRevenueData = {
    dayLabels: chartData.dayLabels,
    paidRevenue: chartData.paidRevenue
  };

  useEffect(() => {
    if (
      loading ||
      !chartData.dayLabels.length
    ) {
      return undefined;
    }

    /*
     * Menghapus instance chart lama.
     */
    charts.current.forEach((chart) => {
      chart.destroy();
    });

    charts.current = [];

    /*
     * Konfigurasi tooltip yang digunakan
     * seluruh chart.
     */
    const commonTooltip = {
      backgroundColor:
        'rgba(15, 20, 25, 0.96)',

      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      cornerRadius: 10,
      padding: 12,
      displayColors: true,
      boxPadding: 5,

      titleFont: {
        size: 12,
        weight: 'bold'
      },

      bodyFont: {
        size: 11
      }
    };

    /*
     * =====================================================
     * GRAFIK PENDAPATAN
     * =====================================================
     */
    if (revenueChartRef.current) {
      const context =
        revenueChartRef.current.getContext(
          '2d'
        );

      const paidGradient =
        context.createLinearGradient(
          0,
          0,
          0,
          310
        );

      paidGradient.addColorStop(
        0,
        'rgba(34, 197, 94, 0.35)'
      );

      paidGradient.addColorStop(
        1,
        'rgba(34, 197, 94, 0.01)'
      );

      const revenueChart = new Chart(
        context,
        {
          type: 'line',

          data: {
            labels:
              displayedRevenueData
                .dayLabels,

            datasets: [
              {
                label:
                  'Pendapatan Lunas',

                data:
                  displayedRevenueData
                    .paidRevenue,

                borderColor: '#22C55E',
                backgroundColor:
                  paidGradient,

                fill: true,
                tension: 0.42,
                borderWidth: 3,

                pointRadius:
                  chartData.dayLabels.length > 14
                    ? 2
                    : 4,

                pointHoverRadius: 7,

                pointBackgroundColor:
                  '#22C55E',

                pointBorderColor:
                  '#ffffff',

                pointBorderWidth: 2,

                pointHoverBackgroundColor:
                  '#ffffff',

                pointHoverBorderColor:
                  '#22C55E',

                pointHoverBorderWidth: 3
              }
            ]
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
              duration: 900,
              easing: 'easeOutQuart'
            },

            interaction: {
              intersect: false,
              mode: 'index'
            },

            layout: {
              padding: {
                top: 5,
                right: 8,
                bottom: 0,
                left: 3
              }
            },

            plugins: {
              legend: {
                position: 'top',
                align: 'end',

                labels: {
                  color: '#cbd5e1',
                  usePointStyle: true,
                  pointStyle: 'circle',
                  boxWidth: 7,
                  boxHeight: 7,
                  padding: 18,

                  font: {
                    size: 11,
                    weight: '500'
                  }
                }
              },

              tooltip: {
                ...commonTooltip,

                callbacks: {
                  title: (items) =>
                    items[0]?.label || '',

                  label: (
                    contextValue
                  ) =>
                    `${
                      contextValue.dataset
                        .label
                    }: ${formatRupiah(
                      contextValue.parsed.y
                    )}`
                }
              }
            },

            scales: {
              x: {
                border: {
                  display: false
                },

                grid: {
                  display: false
                },

                ticks: {
                  color: '#64748b',
                  autoSkip: true,
                  maxRotation: 0,
                  minRotation: 0,

                  maxTicksLimit:
                    chartData.dayLabels.length > 14
                      ? 10
                      : 7,

                  font: {
                    size: 10,
                    weight: '500'
                  }
                }
              },

              y: {
                beginAtZero: true,

                border: {
                  display: false
                },

                grid: {
                  color:
                    'rgba(148, 163, 184, 0.08)',

                  drawTicks: false
                },

                ticks: {
                  color: '#64748b',
                  padding: 10,

                  font: {
                    size: 10
                  },

                  callback: (value) =>
                    formatCompactRupiah(
                      value
                    )
                }
              }
            }
          }
        }
      );

      charts.current.push(
        revenueChart
      );
    }

    /*
     * =====================================================
     * DISTRIBUSI PAKET
     * =====================================================
     */
    if (
      packageChartRef.current &&
      chartData.topPackagesLabels
        .length > 0
    ) {
      const context =
        packageChartRef.current.getContext(
          '2d'
        );

      const packageChart = new Chart(
        context,
        {
          type: 'doughnut',

          data: {
            labels:
              chartData
                .topPackagesLabels,

            datasets: [
              {
                data:
                  chartData
                    .topPackagesValues,

                backgroundColor:
                  PACKAGE_COLORS,

                hoverBackgroundColor:
                  PACKAGE_HOVER_COLORS,

                borderColor: '#1a1f26',
                borderWidth: 4,

                hoverBorderColor:
                  '#1a1f26',

                hoverBorderWidth: 4,
                borderRadius: 6,
                spacing: 3,
                hoverOffset: 10
              }
            ]
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: '68%',

            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 1000,
              easing: 'easeOutQuart'
            },

            plugins: {
              legend: {
                display: false
              },

              tooltip: {
                ...commonTooltip,

                callbacks: {
                  label: (
                    contextValue
                  ) => {
                    const value =
                      contextValue.parsed ||
                      0;

                    const percentage =
                      chartData
                        .topPackagesPercentages[
                        contextValue.dataIndex
                      ] || 0;

                    return `${contextValue.label}: ${value} unit (${percentage}%)`;
                  }
                }
              }
            }
          }
        }
      );

      charts.current.push(
        packageChart
      );
    }

    /*
     * =====================================================
     * ITEM TERLARIS
     * =====================================================
     */
    if (
      itemChartRef.current &&
      chartData.topItemsLabels
        .length > 0
    ) {
      const canvas =
        itemChartRef.current;

      const context =
        canvas.getContext('2d');

      const itemGradient =
        context.createLinearGradient(
          0,
          0,
          canvas.clientWidth || 500,
          0
        );

      itemGradient.addColorStop(
        0,
        '#1D4ED8'
      );

      itemGradient.addColorStop(
        0.55,
        '#3B82F6'
      );

      itemGradient.addColorStop(
        1,
        '#60A5FA'
      );

      const itemChart = new Chart(
        context,
        {
          type: 'bar',

          data: {
            labels:
              chartData.topItemsLabels,

            datasets: [
              {
                label: 'Unit Disewa',

                data:
                  chartData
                    .topItemsValues,

                backgroundColor:
                  itemGradient,

                hoverBackgroundColor:
                  '#60A5FA',

                borderColor: '#93C5FD',
                borderWidth: 1,

                borderRadius: {
                  topLeft: 0,
                  bottomLeft: 0,
                  topRight: 10,
                  bottomRight: 10
                },

                borderSkipped: false,
                maxBarThickness: 32,
                minBarLength: 4
              }
            ]
          },

          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,

            animation: {
              duration: 900,
              easing: 'easeOutQuart'
            },

            interaction: {
              intersect: false,
              mode: 'nearest'
            },

            layout: {
              padding: {
                right: 15,
                top: 5,
                bottom: 5
              }
            },

            plugins: {
              legend: {
                display: false
              },

              tooltip: {
                ...commonTooltip,

                callbacks: {
                  label: (
                    contextValue
                  ) =>
                    `${contextValue.parsed.x} unit disewa`
                }
              }
            },

            scales: {
              x: {
                beginAtZero: true,

                border: {
                  display: false
                },

                grid: {
                  color:
                    'rgba(148, 163, 184, 0.08)',

                  drawTicks: false
                },

                ticks: {
                  color: '#64748b',
                  stepSize: 1,
                  precision: 0,
                  padding: 8,

                  font: {
                    size: 10
                  }
                }
              },

              y: {
                border: {
                  display: false
                },

                grid: {
                  display: false
                },

                ticks: {
                  color: '#cbd5e1',
                  padding: 10,

                  font: {
                    size: 11,
                    weight: '500'
                  },

                  callback:
                    function callback(
                      value
                    ) {
                      const label =
                        this.getLabelForValue(
                          value
                        );

                      return label.length >
                        24
                        ? `${label.substring(
                            0,
                            24
                          )}...`
                        : label;
                    }
                }
              }
            }
          }
        }
      );

      charts.current.push(itemChart);
    }

    return () => {
      charts.current.forEach((chart) => {
        chart.destroy();
      });

      charts.current = [];
    };
  }, [chartData, loading]);

  // Total pendapatan grafik berasal langsung dari query SQL 7 hari terakhir.
  const totalPaidRevenueChart =
    totals.range_paid_revenue;

  const totalBookings =
    totals.total_bookings;

  const totalTopItems =
    totals.top_item_units;

  const totalTopPackages =
    totals.top_package_units;

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E2725B] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* Banner */}
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#1E232A] to-[#13171B] p-4 shadow-xl md:flex-row md:p-5">
          <div className="space-y-0.5">
            <h1 className="text-xl font-black uppercase tracking-wide text-white md:text-2xl">
              Selamat Datang di Dashboard Admin
            </h1>

            <p className="text-xs text-slate-400">
              Kelola data alat, paket,
              booking, pembayaran, dan
              ulasan customer.
            </p>
          </div>

          <div className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {new Date().toLocaleDateString(
              'id-ID',
              {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }
            )}
          </div>
        </div>

        {/* Statistik dashboard */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Pendapatan"
            value={formatRupiah(
              stats?.total_paid_revenue
            )}
            valueClass="text-[#22C55E]"
            description={
              <>
                Total pembayaran paid selama{' '}
                <span className="font-medium text-green-400">
                  7 hari terakhir
                </span>
              </>
            }
          />

          <StatCard
            label="Total Boxing (Paid)"
            value={(
              stats?.total_boxing || 0
            ).toLocaleString('id-ID')}
            valueClass="text-green-400"
            description={
              <>
                Jumlah booking paid selama{' '}
                <span className="font-medium text-green-400">
                  7 hari terakhir
                </span>
              </>
            }
          />

          <StatCard
            label="Total Alat"
            value={(
              stats?.total_equipment || 0
            ).toLocaleString('id-ID')}
            description="Jumlah alat di database"
          />

          <StatCard
            label="Total Paket"
            value={(
              stats?.total_packages || 0
            ).toLocaleString('id-ID')}
            description="Jumlah paket di database"
          />
        </div>

        {/* Grafik pendapatan dan status */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* Grafik pendapatan */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#1d232b] to-[#171c22] p-4 shadow-xl shadow-black/10 lg:col-span-2">
            <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Grafik Pendapatan
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Pendapatan lunas selama 7 hari terakhir
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#E2725B]/30 bg-[#E2725B]/10 px-2.5 py-1.5 text-xs font-medium text-[#F29A86]">
                  {trendPeriodLabel}
                </span>

                <span className="rounded-full border border-green-500/15 bg-green-500/10 px-2.5 py-1.5 text-xs font-medium text-green-400">
                  Lunas:{' '}
                  {formatRupiah(
                    totalPaidRevenueChart
                  )}
                </span>
              </div>
            </div>

            <div className="h-[310px]">
              <canvas
                ref={revenueChartRef}
              />
            </div>
          </div>

          {/* Status booking tanpa chart doughnut */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#1d232b] to-[#171c22] p-4 shadow-xl shadow-black/10">
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <ClipboardList className="h-4 w-4 text-blue-400" />
                Distribusi Status Booking
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Perbandingan jumlah booking
                berdasarkan status
              </p>
            </div>

            <div className="space-y-2">
              {chartData.statusLabels.map(
                (label, index) => {
                  const value =
                    chartData.statusValues[
                      index
                    ] || 0;

                  const percentage =
                    chartData.statusPercentages[
                      index
                    ] || 0;

                  return (
                    <div key={label}>
                      <div className="mb-1 flex justify-between gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[
                                  label
                                ] ||
                                '#64748B'
                            }}
                          />

                          {label}
                        </span>

                        <span className="whitespace-nowrap font-semibold text-slate-300">
                          {value} booking
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,

                            backgroundColor:
                              STATUS_COLORS[
                                label
                              ] ||
                              '#64748B'
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Total booking dipindahkan ke bawah status Dibatalkan */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Total Booking
              </p>

              <p className="text-xl font-black leading-none text-blue-400">
                {totalBookings}
              </p>
            </div>
          </div>
        </div>

        {/* Item dan paket */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Item terlaris */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#1d232b] to-[#171c22] p-4 shadow-xl shadow-black/10">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                  <Package className="h-4 w-4 text-blue-500" />
                  Item Terlaris
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Lima peralatan dengan
                  jumlah penyewaan tertinggi
                </p>
              </div>

              {chartData.topItemsLabels
                .length > 0 && (
                <span className="rounded-full border border-blue-500/15 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                  Top 5
                </span>
              )}
            </div>

            {chartData.topItemsLabels
              .length > 0 ? (
              <>
                <div className="h-[260px]">
                  <canvas
                    ref={itemChartRef}
                  />
                </div>

                <div className="mt-3 border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Total Item Disewa
                    </span>

                    <span className="font-bold text-white">
                      {totalTopItems} unit
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <EmptyChartState
                message="Belum ada data item"
                height="h-[260px]"
              />
            )}
          </div>

          {/* Distribusi paket */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#1d232b] to-[#171c22] p-4 shadow-xl shadow-black/10">
            <div className="mb-3">
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <PieChart className="h-4 w-4 text-violet-400" />
                Distribusi Paket
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Paket yang paling banyak
                dipilih pelanggan
              </p>
            </div>

            {chartData.topPackagesLabels
              .length > 0 ? (
              <>
                <div className="relative mx-auto h-[220px] max-w-[320px]">
                  <canvas
                    ref={packageChartRef}
                  />

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">
                      {totalTopPackages}
                    </span>

                    <span className="text-[9px] uppercase tracking-wider text-slate-500">
                      Unit
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {chartData.topPackagesLabels.map(
                    (
                      packageName,
                      index
                    ) => (
                      <div
                        key={`${packageName}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/35 px-3 py-2"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 flex-none rounded-full"
                            style={{
                              backgroundColor:
                                PACKAGE_COLORS[
                                  index %
                                    PACKAGE_COLORS.length
                                ]
                            }}
                          />

                          <span className="truncate text-xs text-slate-400">
                            {packageName}
                          </span>
                        </div>

                        <span className="whitespace-nowrap text-xs font-semibold text-white">
                          {
                            chartData
                              .topPackagesValues[
                              index
                            ]
                          }{' '}
                          unit
                        </span>
                      </div>
                    )
                  )}
                </div>
              </>
            ) : (
              <EmptyChartState
                message="Belum ada data paket"
                height="h-[260px]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  valueClass = 'text-white'
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#1a1f26] p-4 shadow-xl shadow-slate-950/20">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <h3
        className={`mt-1 text-2xl font-black ${valueClass}`}
      >
        {value}
      </h3>

      <p className="mt-0.5 text-[10px] text-slate-400">
        {description}
      </p>
    </div>
  );
}

function EmptyChartState({
  message,
  height
}) {
  return (
    <div
      className={`flex ${height} items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20`}
    >
      <p className="text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
}