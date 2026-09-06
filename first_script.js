<script>
                    document.addEventListener('DOMContentLoaded', async function () {
                        try {
                            const commodityText = "Commodity"; // Pass the translated string to JavaScript
                            const RecoText = "Rec"; // Pass the translated string to JavaScript
                            const FixedText = "Fixed"; // Pass the translated string to JavaScript

                            // Parse the years JSON passed from the server-side
                            const years = ["2026-27","2025-26","2024-25","2023-24","2022-23","2021-22","2020-21","2019-20","2018-19","2017-18","2016-17","2015-16","2014-15","2013-14","2012-13","2011-12","2010-11"];

                            const tableHeader = document.getElementById('tableHeader');
                            const tableBody = document.getElementById('tableBody');

                            // Clear existing table content
                            tableHeader.innerHTML = '';
                            tableBody.innerHTML = '';

                            // Create header rows
                            const headerRow1 = document.createElement('tr');
                            const headerRow2 = document.createElement('tr');

                            const commodityHeader = document.createElement('th');
                            commodityHeader.textContent = commodityText;
                            commodityHeader.rowSpan = 2;
                            headerRow1.appendChild(commodityHeader);

                            years.forEach(year => {
                                const yearHeader = document.createElement('th');
                                yearHeader.textContent = year;
                                yearHeader.colSpan = 2;
                                headerRow1.appendChild(yearHeader);

                                const recoHeader = document.createElement('th');
                                recoHeader.textContent = RecoText;
                                headerRow2.appendChild(recoHeader);

                                const fixedHeader = document.createElement('th');
                                fixedHeader.textContent = FixedText;
                                headerRow2.appendChild(fixedHeader);
                            });

                            tableHeader.appendChild(headerRow1);
                            tableHeader.appendChild(headerRow2);

                            const response = await fetch('/json.json'); // Adjust path as per your file location
                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }
                            const data = await response.json();

                            // Get unique seasons and commodities
                            const uniqueSeasons = [...new Set(data.map(item => item.seasonname))];
                            const uniqueCommodities = [...new Set(data.map(item => item.commodityname))];

                            // Iterate through unique seasons
                            uniqueSeasons.forEach(season => {
                                // Create a new row for the season heading
                                const seasonHeaderRow = document.createElement('tr');
                                seasonHeaderRow.style.backgroundColor = '#014F75'; // Change to your desired color
                                seasonHeaderRow.style.color = '#fff'; // Change to your desired text color

                                const seasonHeaderCell = document.createElement('td');
                                seasonHeaderCell.textContent = season;
                                seasonHeaderCell.classList.add('season-header');
                                // seasonHeaderCell.colSpan = years.length * 2 + 1; // Span across all columns
                                seasonHeaderRow.appendChild(seasonHeaderCell);

                                // Add empty cells for the rest of the columns
                                for (let i = 0; i < years.length * 2; i++) {
                                    const emptyCell = document.createElement('td');
                                    seasonHeaderRow.appendChild(emptyCell);
                                }

                                tableBody.appendChild(seasonHeaderRow);

                                // Iterate through unique commodities
                                uniqueCommodities.forEach(commodity => {
                                    // Filter data for current season and commodity
                                    const filteredData = data.filter(item => item.seasonname === season && item.commodityname === commodity);

                                    if (filteredData.length > 0) {
                                        const tableRow = document.createElement('tr');

                                        const commodityCell = document.createElement('td');
                                        commodityCell.textContent = commodity;
                                        tableRow.appendChild(commodityCell);
                                        const years = [...new Set(filteredData.map(item => item.financialyear))];
                                        // Iterate through years
                                        years.forEach(year => {
                                            // Find data for current year
                                            const yearData = filteredData.find(item => item.financialyear === year);

                                            // Create cells for reco_price and fixed_price
                                            const recoPriceCell = document.createElement('td');
                                            recoPriceCell.textContent = yearData && yearData.reco_price ? yearData.reco_price : '';
                                            tableRow.appendChild(recoPriceCell);

                                            const fixedPriceCell = document.createElement('td');
                                            fixedPriceCell.textContent = yearData && yearData.fixed_price ? yearData.fixed_price : '';
                                            tableRow.appendChild(fixedPriceCell);
                                        });

                                        tableBody.appendChild(tableRow);
                                    }
                                });
                            });
                        } catch (error) {
                            console.error('Error loading data:', error);
                        }
                    });
                </script>