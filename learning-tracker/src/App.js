import React, { useState } from "react";
import './App.css';
import trashIcon from './trash.svg'; // Ensure this import is correct
import ChartComponent from './ChartComponent';

function AssignmentTracker() {
  const [className, setClassName] = useState("");
  const [learningTargets, setLearningTargets] = useState([]);
  const [learningTargetInput, setLearningTargetInput] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [showChart, setShowChart] = useState(false);

  // Add a new learning target
  const handleAddLearningTarget = () => {
    if (learningTargetInput) {
      setLearningTargets((prevTargets) => [...prevTargets, learningTargetInput]);
      setLearningTargetInput("");
    }
  };

  // Edit a learning target
  const handleEditLearningTarget = (index, newValue) => {
    setLearningTargets((prevTargets) => {
      const updatedTargets = [...prevTargets];
      updatedTargets[index] = newValue;
      return updatedTargets;
    });
  };

  // Delete a learning target
  const handleDeleteLearningTarget = (index) => {
    setLearningTargets((prevTargets) => {
      const updatedTargets = [...prevTargets];
      updatedTargets.splice(index, 1);
      return updatedTargets;
    });
  };

  // Add a new row to the assignment table
  const handleAddAssignment = () => {
    if (className) {
      const newAssignment = {
        name: "",
        categories: learningTargets.reduce((acc, target) => {
          acc[target] = "IE"; // Default grade
          return acc;
        }, {}),
      };
      setAssignments([...assignments, newAssignment]);
    }
  };

  // Edit assignment data directly in the table
  const handleEditAssignment = (index, field, value) => {
    setAssignments((prevAssignments) => {
      const updated = [...prevAssignments];
      if (field === "categories") {
        updated[index].categories = {
          ...updated[index].categories,
          ...value,
        };
      } else {
        updated[index][field] = value;
      }
      return updated;
    });
  };

  // Delete an assignment row
  const handleDeleteAssignment = (index) => {
    setAssignments((prevAssignments) => {
      const updated = [...prevAssignments];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Export data as JSON
  const handleExportData = () => {
    const data = JSON.stringify(assignments, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assignments.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">
      {/* First container - Assignment Tracker */}
      <div className="container">
        <h1>Assignment Tracker</h1>

        {/* Class Name Input */}
        <div>
          <label>Class Name</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
          />
        </div>

        {/* Learning Targets */}
        <div>
          <label>Learning Targets</label>
          <div>
            {learningTargets.map((target, index) => (
              <div key={index} className="learning-target">
                <input
                  type="text"
                  value={target}
                  onChange={(e) =>
                    handleEditLearningTarget(index, e.target.value)
                  }
                />
                <img
                  src={trashIcon}
                  alt="Delete"
                  className="trash-icon"
                  onClick={() => handleDeleteLearningTarget(index)}
                />
              </div>
            ))}
          </div>
          <div className="learning-target-input">
            <input
              type="text"
              value={learningTargetInput}
              onChange={(e) => setLearningTargetInput(e.target.value)}
              placeholder="Add new learning target"
            />
            <button
              onClick={handleAddLearningTarget}
              className="add-learning-target-button"
            >
              Add
            </button>
          </div>
        </div>

        {/* Assignments Header */}
        <div>
          <label>Assignments</label>
        </div>

        {/* Assignment Table */}
        <div className="table-container">
          <div className="assignment-container">
            <table className="assignment-table">
              <thead>
                <tr>
                  <th>Name</th>
                  {learningTargets.map((target) => (
                    <th key={target}>{target}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan={learningTargets.length + 1} className="no-assignments">
                      No assignments added yet
                    </td>
                  </tr>
                ) : (
                  assignments.map((assignment, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={assignment.name}
                          onChange={(e) =>
                            handleEditAssignment(index, "name", e.target.value)
                          }
                        />
                      </td>
                      {learningTargets.map((target) => (
                        <td key={target}>
                          <select
                            value={assignment.categories[target]}
                            onChange={(e) =>
                              handleEditAssignment(index, "categories", {
                                [target]: e.target.value,
                              })
                            }
                          >
                            <option value="Ed">Exhibiting Depth (Ed)</option>
                            <option value="Ex">Exhibiting (Ex)</option>
                            <option value="De">Developing (De)</option>
                            <option value="Em">Emerging (Em)</option>
                            <option value="IE">Insufficient Evidence (IE)</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {assignments.length > 0 && (
              <div className="trash-icon-container">
                {assignments.map((_, index) => (
                  <div key={index} className="icon-cell">
                    <img
                      src={trashIcon}
                      alt="Delete"
                      className="trash-icon"
                      onClick={() => handleDeleteAssignment(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Assignment Button */}
        <button className="add-assignment-button" onClick={handleAddAssignment}>
          Add Assignment
        </button>

        {/* Export Button */}
        <button className="export-button" onClick={handleExportData}>
          Export Data
        </button>
        
        {/* Toggle Chart Button */}
        <button 
          className="chart-button" 
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? 'Hide Chart' : 'Show Chart'}
        </button>
      </div>

      {/* Second container - Chart Component (when visible) */}
      {showChart && assignments.length > 0 && (
        <div className="container chart-container">
          <h2>Learning Progress Chart</h2>
          <div className="chart-outer-wrapper">
            <ChartComponent assignmentData={assignments} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentTracker;