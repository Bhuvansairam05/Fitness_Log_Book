let addExercise = document.getElementById("addExercise");
    const apiurl = "https://68231738b342dce80050a680.mockapi.io/FitnessLogBook";
    addExercise.addEventListener("click",()=>{
        let exerciseForm = document.querySelector('#addExerciseForm');
        exerciseForm.classList.remove("hidden");
        let saveItem = document.getElementById("saveExercise");
        saveItem.addEventListener("click",()=>{
            let ename = document.getElementById("ExerciseName").value;
            let duration = document.getElementById("Duration").value;
            let caloriesBurned = document.getElementById("CaloriesBurned").value;
            let date = document.getElementById("Date").value;
            if(!ename || !duration || !caloriesBurned || !date){
                alert("enter details");
                return;

            }
            let xhr = new XMLHttpRequest();
            xhr.open("POST",apiurl,true);
            xhr.setRequestHeader("Content-Type", "application/json");
             let exerciseData = {
                name: ename,
                duration: duration,
                caloriesBurned: caloriesBurned,
                date: date
            };

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 201 || xhr.status === 200) {
                        exerciseForm.reset();
                        loadExercises();
                    } else {
                        alert("Failed to save exercise. Please try again.");
                    }
                }
            };
            xhr.send(JSON.stringify(exerciseData));
            exerciseForm.classList.add("hidden");
        });
    });
    function loadExercises() {
        let xhr = new XMLHttpRequest();
        let apiUrl = "https://<your-mockapi-url>/exercises"; // Replace with actual mock API URL

        xhr.open("GET", apiurl, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    let tableBody = document.getElementById("fitnessTableBody");
                    tableBody.innerHTML = ""; // Clear previous rows

                    data.forEach(exercise => {
                        let row = document.createElement("tr");
                        row.id=`row-${exercise.id}`;
                        row.innerHTML = `
                            <td>${exercise.name}</td>
                            <td>${exercise.duration} min</td>
                            <td>${exercise.caloriesBurned} cal</td>
                            <td>${exercise.date}</td>
                            <td>
                                <button class="update" onclick="updateRow(${exercise.id})">Update</button>
                                <button class="delete" onclick="deleteRow(${exercise.id})">Delete</button>
                            </td>
                        `;
                            
                        tableBody.appendChild(row);
                    });
                } else {
                    alert("Failed to load exercises");
                }
            }
        };

        xhr.send();
    }
    function deleteRow(id){
       if(confirm("Are you sure want to delete exercise from table")){
            
            let row = id;
            let xhr = new XMLHttpRequest();
            xhr.open("DELETE",`${apiurl}/${id}`,true);
            xhr.onreadystatechange = function(){
                // console.log(id);
                if(xhr.readyState===4){
                    if(xhr.status===200 || xhr.status===204){

                        loadExercises();
                    }else{
                        alert(" Failed to load Data");
                    }
                }
                
            }
            xhr.send();
       }
    }  
    function updateRow(id) {
    const row = document.getElementById(`row-${id}`);
    const cells = row.getElementsByTagName("td");
    if (cells[0].querySelector("input")) return;
    const originalName = cells[0].innerText;
    const originalDuration = cells[1].innerText.replace(" min", "");
    const originalCalories = cells[2].innerText.replace(" cal", "");
    const originalDate = cells[3].innerText;
    cells[0].innerHTML = `<input type="text" value="${originalName}" id="edit-name-${id}">`;
    cells[1].innerHTML = `<input type="number" value="${originalDuration}" id="edit-duration-${id}">`;
    cells[2].innerHTML = `<input type="number" value="${originalCalories}" id="edit-calories-${id}">`;
    cells[3].innerHTML = `<input type="date" value="${originalDate}" id="edit-date-${id}">`;
    cells[4].innerHTML = `
        <button class="save" onclick="save(${id})">Save</button>
        <button class="delete" onclick="loadExercises()">Cancel</button>
        <button class="update" onclick="deleteRow(${id})">Delete</button>
    `;
}
function save(id) {
        const newName = document.getElementById(`edit-name-${id}`).value.trim();
        const newDuration = document.getElementById(`edit-duration-${id}`).value;
        const newCalories = document.getElementById(`edit-calories-${id}`).value;
        const newDate = document.getElementById(`edit-date-${id}`).value;

        if (!newName || !newDuration || !newCalories || !newDate) {
            alert("All fields must be filled.");
            return;
        }

        const updatedData = {
            name: newName,
            duration: newDuration,
            caloriesBurned: newCalories,
            date: newDate
        };

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `${apiurl}/${id}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 204) {
                    
                    loadExercises(); // Refresh table
                } else {
                    alert("Failed to update exercise.");
                }
            }
        };

        xhr.send(JSON.stringify(updatedData));
    }

    window.onload = function () {
        loadExercises();
    };