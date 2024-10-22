
    let users = [];
    const allLanes = ["탑", "정글", "미드", "원딜", "서폿"];

    const tierOrder = {
        "언랭크": 10,
        "아이언": 12,
        "브론즈": 12,
        "실버 하위": 17,
        "실버 상위": 20,
        "골드 하위": 22,
        "골드 상위": 25,
        "플레티넘 하위": 27,
        "플레티넘 상위": 30,
        "에메랄드 하위": 32,
        "에메랄드 상위": 35,
        "다이아 하위": 38,
        "다이아 상위": 41,
        "마스터": 44,
        "그랜드마스터": 47,
        "챌린저": 50
    };


    // 팀 생성 가능여부
    let selectedTeams = {};
    let matchAble = false;
    let totalTeams = 0;
    let usersPerTeam = 5;
    let totalUsersNeeded = 0;

    


     // 시작할 때 팀 정보 설정
     function startUserInput(){
        totalTeams = parseInt(document.getElementById("teamCount").value);
        // usersPerTeam = parseInt(document.getElementById("teamUserCount").value);
        totalUsersNeeded = totalTeams * usersPerTeam;
        
        if(totalTeams > 0 && totalTeams <= 10 && usersPerTeam > 0 && usersPerTeam <= 10) {
            document.getElementById("teamSettingInputContainer").style.display = "none";
            document.getElementById("userInputContainer").style.display = "block";
            document.getElementById("teamInfoHeader").style.display = "block";
            document.getElementById("teamInfoHeader").textContent = `총 팀 개수: ${totalTeams}, 팀별 유저 수: ${usersPerTeam}`;
            document.getElementById("matchingButtonContainer").style.display = "block";
            document.getElementById("teamOutputContainer").style.display = "block";

            // 초기 팀 설정 (동적으로 팀 생성)
            for (let i = 1; i <= totalTeams; i++) {
                selectedTeams[`team${i}`] = new Set();
            }
        } else {
            alert("팀 수는 1 <= 10, 팀별 인원 수는 1 <= 10 사이여야 합니다.");
        }
    }

    // 고유 ID 생성 함수
    function generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    // 배열과 각 요소의 preferredLines 배열을 동시에 섞는 함수
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // 위치 바꿀 유저 index random 추출
            const j = Math.floor(Math.random() * (i + 1));

            // 각 요소의 선호 라인 배열도 무작위로 섞기
            if (array[i].preferredLines && Array.isArray(array[i].preferredLines)) {
                shuffleLines(array[i].preferredLines);
            }
            // 각 요소의 가능 라인 배열도 무작위로 섞기
            if (array[i].possibleLines && Array.isArray(array[i].possibleLines)) {
                shuffleLines(array[i].possibleLines);
            }

            // 각 요소의 선호 라인 배열도 무작위로 섞기
            if (array[j].preferredLines && Array.isArray(array[j].preferredLines)) {
                shuffleLines(array[j].preferredLines);
            }
            // 각 요소의 가능 라인 배열도 무작위로 섞기
            if (array[j].possibleLines && Array.isArray(array[j].possibleLines)) {
                shuffleLines(array[j].possibleLines);
            }

            // 두 요소 섞기
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function shuffleLines(array){
        for (let k = array.length - 1; k > 0; k--) {
            const m = Math.floor(Math.random() * (k + 1));
            [array[k], array[m]] = [array[m], array[k]];
        }
    }

    function parseUserInput() {
        const textInput = document.getElementById("userTextInput").value.trim();
        const lines = textInput.split("\n").filter(line => line.trim() !== "");

        if (users.length + lines.length > totalUsersNeeded) {
            alert(`총 유저 수가 ${totalUsersNeeded}명을 초과할 수 없습니다.`);
            return;
        }
        const newUsers = lines.map(line => {
            const [name, tier, preferred = "", excluded = ""] = line.split("/").map(item => item.trim());

            const excludedLines = excluded ? excluded.split(",").map(l => l.trim()) : [];
            const preferredLines = preferred ? preferred.split(",").map(l => l.trim()) : [];
            const possibleLines = excludedLines.length > 0
                ? allLanes.filter(lane => !excludedLines.includes(lane))
                : allLanes;

            return {
                id: generateUserId(),  // 고유 ID 할당
                name: name.trim(),
                tier: tier.trim(),
                tierValue: tierOrder[tier.trim()] || 0,
                preferredLines: preferredLines,
                excludedLines: excludedLines,
                possibleLines: possibleLines
            };
        });

        users.push(...newUsers);
        document.getElementById("userTextInput").value = "";
        displayUserGrid();


        if(users.length == totalUsersNeeded) {
            matchAble = true;
            document.getElementById("showTeamPopupButton").style.display = "inline-block";
        }
        toggleMatchAble();
    }
    



    // 함수 정의
    function updateButtonStyle() {
        const button = document.getElementById('matchTeamsButton');

        if (matchAble) {
            // 버튼 활성화 스타일
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            button.disabled=false;
        } else {
            // 버튼 비활성화 스타일
            button.style.backgroundColor = 'transparent';
            button.style.color = 'rgba(0, 0, 0, 0.5)';
            button.style.border = '1px solid rgba(0, 0, 0, 0.3)';
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.5';
            button.disabled=true;
        }
    }

    // matchAble 값이 변경될 때 호출하여 스타일을 업데이트
    function toggleMatchAble() {
        updateButtonStyle();
    }

    // 초기 상태 설정
    updateButtonStyle();

    function displayUserGrid() {
        const userGrid = document.getElementById("userGrid");
        userGrid.innerHTML = '';
        
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.classList.add('grid-item');
            userItem.innerHTML = `
                    <strong>${user.name}</strong><br>
                    티어: ${user.tier}<br>
                    선호 라인: ${user.preferredLines.join(", ") || "없음"}<br>
                    제외 라인: ${user.excludedLines.join(", ") || "없음"}<br>
                    가능 라인: ${user.possibleLines.join(", ")}
                `;
            userGrid.appendChild(userItem);
        });
    }

    function showTeamPopup() {
        document.getElementById("teamPopup").style.display = "block";
        updateTeamSelections();
    }

    function closePopup() {
        document.getElementById("teamPopup").style.display = "none";
    }

    // 팀별로 체크박스를 생성하여 UI를 업데이트하고, 선택된 유저를 다른 팀에서 중복 선택되지 않게 비활성화하는 함수
    function updateTeamSelections() {
        const teamSelectionContainer = document.getElementById("teamSelectionContainer");
        teamSelectionContainer.innerHTML = "";

        // 각 팀에 대해 선택 영역을 동적으로 생성
        Object.keys(selectedTeams).forEach(teamKey => {
            const teamContainer = document.createElement("div");
            teamContainer.classList.add("team-box");
            teamContainer.innerHTML = `<h3>${teamKey}</h3>`;

            users.forEach(user => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = user.id;
                checkbox.id = `${teamKey}_${user.id}`;
                checkbox.checked = selectedTeams[teamKey].has(user.id);

                // 유저가 다른 팀에 선택된 경우 비활성화
                checkbox.disabled = isUserSelectedInOtherTeams(user.id, teamKey);

                checkbox.addEventListener("change", () => handleCheckboxSelection(user.id, teamKey));

                const label = document.createElement("label");
                label.htmlFor = `${teamKey}_${user.id}`;
                label.textContent = `${user.name} (${user.tier})`;

                teamContainer.appendChild(checkbox);
                teamContainer.appendChild(label);
                teamContainer.appendChild(document.createElement("br"));
            });

            teamSelectionContainer.appendChild(teamContainer);
        });
    }

    // 특정 유저가 다른 팀에 이미 선택되었는지 확인하는 함수
    function isUserSelectedInOtherTeams(userId, currentTeam) {
        return Object.keys(selectedTeams).some(teamKey => teamKey !== currentTeam && selectedTeams[teamKey].has(userId));
    }

    // 체크박스 선택 시 중복 방지 및 팀에 유저 추가
    function handleCheckboxSelection(userId, teamKey) {
        if (selectedTeams[teamKey].has(userId)) {
            selectedTeams[teamKey].delete(userId);
        } else {
            selectedTeams[teamKey].add(userId);
        }

        // 선택 변경 후 다른 팀 선택 비활성화 업데이트
        updateTeamSelections();
    }

    function completeSelection() {
        document.getElementById("teamPopup").style.display = "none";
    }


    function clearUsers() {

        // 유저 배열 초기화
        users = [];
        selectedTeams = {};
        matchAble = false;
        totalTeams = 0;
        usersPerTeam = 5;
        totalUsersNeeded = 0;

        // // 팀 선택 초기화
        // Object.keys(selectedTeams).forEach(teamKey => {
        //     selectedTeams[teamKey].clear();
        // });

        // UI 요소 초기화
        document.getElementById("teamSettingInputContainer").style.display = "block"; // 팀 설정 UI 보이기
        document.getElementById("userInputContainer").style.display = "none"; // 유저 입력 UI 숨기기
        document.getElementById("teamInfoHeader").style.display = "none"; // 팀 정보 숨기기
        document.getElementById("teamOutputContainer").innerHTML = ""; // 매칭 결과 초기화

        document.getElementById("showTeamPopupButton").style.display = "none"; // 유저 조합 선택 버튼 숨기기
        document.getElementById("matchTeamsButton").style.display = "inline-block"; // 매칭 시작 버튼 보이기
        document.getElementById("rematchButton").style.display = "none"; // 재매치 버튼 숨기기
        // document.getElementById("resetButton").style.display = "none"; // 초기화 버튼 숨기기
        document.getElementById("userGrid").innerHTML = '';
        // 기타 상태 초기화
        updateButtonStyle()
        displayUserGrid(); // 유저 목록 초기화
    }


    function assignRemainingUsersToEmptyLines(team, remainingUsers, assignedUsers) {
        for (const line of Object.keys(team)) {
            if (team[line] === null && remainingUsers.length > 0) {
                const user = remainingUsers.pop();
                team[line] = { ...user, matchedLine: line };
                assignedUsers.add(user.id);
            }
        }
    }

    function matchTeams(rematch) {
        if (!rematch) {
            document.getElementById("matchTeamsButton").style.display = "none";
        }

        let maxRetries = 10000; // 최대 재매치 시도 횟수
        let retryCount = 0;
        let acceptableTierDifference = 0;

        let teams = [];
        let assignedUsers = new Set();

        while (retryCount < maxRetries) {
            shuffleArray(users);
            assignedUsers = new Set();

            teams = [];
            // 초기화: 팀 수에 따라 빈 팀 생성
            for (let i = 1; i <= totalTeams; i++) {
                teams.push({ 탑: null, 정글: null, 미드: null, 원딜: null, 서폿: null });
            }

            // 각 팀에 대해 선택된 유저를 우선 배정
            Object.keys(selectedTeams).forEach((teamKey, index) => {
                selectedTeams[teamKey].forEach(userId => {
                    const user = users.find(u => u.id === userId);
                    if (user) {
                        let assigned = assignToTeam(user, teams[index], true);
                        if (!assigned) assigned = assignToTeam(user, teams[index], false);
                        if (assigned) assignedUsers.add(user.id);
                    }
                });
            });

            // 남은 유저를 각 팀에 선호 라인과 가능 라인을 기반으로 배정
            users.forEach(user => {
                if (!assignedUsers.has(user.id)) {
                    for (const team of teams) {
                        let assigned = assignToTeam(user, team, true);
                        if (assigned) {
                            assignedUsers.add(user.id);
                            break;
                        }
                    }
                }
                if (!assignedUsers.has(user.id)) {
                    for (const team of teams) {
                        let assigned = assignToTeam(user, team, false);
                        if (assigned) {
                            assignedUsers.add(user.id);
                            break;
                        }
                    }
                }
            });

            // 빈 자리에 남은 유저 강제 배정
            const remainingUsers = users.filter(user => !assignedUsers.has(user.id));
            for (const team of teams) {
                assignRemainingUsersToEmptyLines(team, remainingUsers, assignedUsers);
            }

            // 4. 티어 합 계산
            const teamTierSums = teams.map(calculateTeamTierSum);

            // 5. 티어 차이가 허용 범위 이내면 종료
            // 모든 팀 간의 티어 차이가 허용 범위 이내인지 확인
            if (isWithinAcceptableDifference(teamTierSums, acceptableTierDifference)) {
                break; // 모든 팀 간의 차이가 허용 범위 내에 있으면 매칭 종료
            } else {
                retryCount++;
                if (retryCount % 100 === 0) acceptableTierDifference++;
            }
        }
        

        // 매칭 결과 출력
        displayMatchedTeams(teams);
    }

    // 모든 팀 간 티어 차이가 허용 범위 이내인지 확인하는 함수
    function isWithinAcceptableDifference(tierSums, acceptableDifference) {
        for (let i = 0; i < tierSums.length; i++) {
            for (let j = i + 1; j < tierSums.length; j++) {
                const difference = Math.abs(tierSums[i] - tierSums[j]);
                if (difference > acceptableDifference) {
                    return false; // 허용 범위를 벗어나는 차이가 있을 경우
                }
            }
        }
        return true; // 모든 팀 간 차이가 허용 범위 내에 있을 경우
    }

    function displayMatchedTeams(teams) {
        const teamTableContainer = document.getElementById("teamTableContainer");
        const lanes = ["탑", "정글", "미드", "원딜", "서폿"];

        let tableHTML = `
            <table>
                <tr>
                    <th>라인</th>
                    ${teams.map((_, i) => `<th colspan="2">${i + 1}팀</th>`).join('')}
                </tr>`;

        lanes.forEach(lane => {
            tableHTML += `<tr><td>${lane}</td>`;
            teams.forEach(team => {
                const user = team[lane];
                tableHTML += `<td>${user ? user.name : ''}</td><td>${user ? user.tier : ''}</td>`;
            });
            tableHTML += '</tr>';
        });

        // 팀별 총 티어 합
        tableHTML += `<tr><td>총 티어 합</td>`;
        teams.forEach(team => {
            const teamTierSum = calculateTeamTierSum(team);
            tableHTML += `<td colspan="2">${teamTierSum}</td>`;
        });
        tableHTML += `</tr></table>`;

        teamTableContainer.innerHTML = tableHTML;
    }


    function calculateTeamTierSum(team) {
        if (!team) return 0; // 팀이 null 또는 undefined일 때 0을 반환하여 오류 방지
        
        return Object.entries(team).reduce((sum, [line, user]) => {
            if (!user) return sum;
            
            let additionalScore = 0;
            switch (line) {
                case "정글":
                case "원딜":
                    additionalScore = 1;
                    break;
                case "미드":
                    additionalScore = 2;
                    break;
                default:
                    additionalScore = 0;
                    break;
            }
            
            return sum + user.tierValue + additionalScore;
        }, 0);
    }

    function displayMatchedTeams(teams) {
        const teamTableContainer = document.getElementById("teamTableContainer");
        const lanes = ["탑", "정글", "미드", "원딜", "서폿"];

        let tableHTML = `
            <table>
                <tr>
                    <th>라인</th>
                    ${teams.map((_, i) => `<th colspan="2">${i + 1}팀</th>`).join('')}
                </tr>`;

        lanes.forEach(lane => {
            tableHTML += `<tr><td>${lane}</td>`;
            teams.forEach(team => {
                const user = team[lane];
                tableHTML += `<td>${user ? user.name : ''}</td><td>${user ? user.tier : ''}</td>`;
            });
            tableHTML += '</tr>';
        });

        // 팀별 총 티어 합
        tableHTML += `<tr><td>총 티어 합</td>`;
        teams.forEach(team => {
            const teamTierSum = calculateTeamTierSum(team);
            tableHTML += `<td colspan="2">${teamTierSum}</td>`;
        });
        tableHTML += `</tr></table>`;

        teamTableContainer.innerHTML = tableHTML;

        if(matchAble) {
            document.getElementById("rematchButton").style.display="inline-block";
        }
        // document.getElementById("resetButton").style.display="inline-block";
    }

    function assignToTeam(user, team, preferred = true) {
        const linesToCheck = preferred ? user.preferredLines : user.possibleLines;
        const shuffledLines = [...linesToCheck].sort(() => Math.random() - 0.5);

        for (const line of shuffledLines) {
            if (team[line] === null) {
                team[line] = { ...user, matchedLine: line };
                return true;
            }
        }
        return false;
    }

    // function displayMatchedTeams(team1, team2) {
    //     const teamTableContainer = document.getElementById("teamTableContainer");
    //     const lanes = ["탑", "정글", "미드", "원딜", "서폿"];

    //     const team1TierSum = calculateTeamTierSum(team1);
    //     const team2TierSum = calculateTeamTierSum(team2);

    //     let tableHTML = `
    //             <table>
    //                 <tr>
    //                     <th colspan="1"></th>
    //                     <th colspan="2">1팀</th>
    //                     <th colspan="3">2팀</th>
    //                 </tr>
    //                 <tr>
    //                     <th>라인</th>
    //                     <th>유저명</th>
    //                     <th>티어</th>
    //                     <th>티어</th>
    //                     <th>유저명</th>
    //                 </tr>`;

    //     lanes.forEach(lane => {
    //         const team1User = team1[lane] ? team1[lane] : { name: "", tier: "", matchedLine: lane };
    //         const team2User = team2[lane] ? team2[lane] : { name: "", tier: "", matchedLine: lane };
    //         tableHTML += `
    //                 <tr>
    //                    <td>${lane}</td>
    //                     <td>${team1User.name}</td>
    //                     <td>${team1User.tier}</td>
    //                     <td>${team2User.tier}</td>
    //                     <td>${team2User.name}</td>
    //                 </tr>`;
    //     });

    //     tableHTML += `
    //             <tr>
    //                <td colspan="1">총 티어 합</td>
    //                 <td colspan="2">${team1TierSum}</td>
    //                 <td colspan="2">${team2TierSum}</td>
    //             </tr>
    //         </table>`;

    //     teamTableContainer.innerHTML = tableHTML;

    //     if(matchAble) {
    //         document.getElementById("rematchButton").style.display="inline-block";
    //     }
    //     document.getElementById("resetButton").style.display="inline-block";
    // }

    document.getElementById("start").addEventListener("click", startUserInput);
    document.getElementById("parseUserButton").addEventListener("click", parseUserInput);
    document.getElementById("showTeamPopupButton").addEventListener("click", showTeamPopup);
    document.getElementById("completeSelectionButton").addEventListener("click", completeSelection);
    document.getElementById("closePopupButton").addEventListener("click", closePopup);
    document.getElementById("matchTeamsButton").addEventListener("click", () => matchTeams(false));
    document.getElementById("rematchButton").addEventListener("click", () => matchTeams(true));
    // document.getElementById("resetButton").addEventListener("click", clearUsers);
