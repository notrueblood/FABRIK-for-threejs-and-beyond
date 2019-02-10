/*******************************************************************************
By Noah Trueblood on 19 February 2019

An implementation of FABRIK aside a little library intended to ease IK chain
manipulation making projects with threejs and beyond.

This file contains the implementation of FABRIK as well as a function for
interpolating between goal/target points. The function is called moveTowards.
*******************************************************************************/
function distance(firstPoint, secondPoint) {
  const xDif = Math.abs(secondPoint.x - firstPoint.x);
  const yDif = Math.abs(secondPoint.y - firstPoint.y);
  const zDif = Math.abs(secondPoint.z - firstPoint.z);

  const dist = Math.sqrt(xDif * xDif + yDif * yDif + zDif * zDif);

  return dist;
}

function needToMove(endEffectorPos, goalPos, epsilon) {
  const distFromGoal = distance(endEffectorPos, goalPos);

  return (distFromGoal > epsilon);
}

function targetReachable(points, goalPos) {
  const basePoint = points[0];
  let maxReach = 0;

  let lastPoint = basePoint;
  points.forEach((point) => {
    maxReach += distance(lastPoint, point);
    lastPoint = point;
  });

  const distFromGoal = distance(basePoint, goalPos);

  const isReachable = distFromGoal <= maxReach;

  return { isReachable, maxReach };
}

function findMagnitude(vector) {
  const xSqrd = vector.x * vector.x;
  const ySqrd = vector.y * vector.y;
  const zSqrd = vector.z * vector.z;

  const mag = Math.sqrt(xSqrd + ySqrd + zSqrd);

  return mag;
}

function normalize(vector) {
  const mag = findMagnitude(vector);

  const normX = vector.x / mag;
  const normY = vector.y / mag;
  const normZ = vector.z / mag;

  const normVec = { x: normX, y: normY, z: normZ };

  return normVec;
}

// Part one
function fabrik_finalToRoot(points, goalPos) {
  let currentGoal = goalPos;

  for (let i = points.length - 1; i > 0; i -= 1) {
    const length = distance(points[i - 1], points[i]);

    points[i] = {
      x: currentGoal.x,
      y: currentGoal.y,
      z: currentGoal.z,
    };

    const lineCurGoalToCurManip = {
      x: points[i - 1].x - currentGoal.x,
      y: points[i - 1].y - currentGoal.y,
      z: points[i - 1].z - currentGoal.z,
    }

    const lineDirection = normalize(lineCurGoalToCurManip);

    const updatedLength = {
      x: lineDirection.x * length,
      y: lineDirection.y * length,
      z: lineDirection.z * length,
    };

    currentGoal = {
      x: currentGoal.x + updatedLength.x,
      y: currentGoal.y + updatedLength.y,
      z: currentGoal.z + updatedLength.z,
    }
  }

  return points;
}

// Part two
function fabrik_rootToFinal(points, goalPos, length) {
  let base = points[0];

  for(let i = 0; i < points.length - 1; i += 1) {
    const lineCurGoalToCurPt = {
      x: points[i + 1].x - points[i].x,
      y: points[i + 1].y - points[i].y,
      z: points[i + 1].z - points[i].z,
    }

    const lineDirection = normalize(lineCurGoalToCurPt);

    const updatedLength = {
      x: lineDirection.x * length,
      y: lineDirection.y * length,
      z: lineDirection.z * length,
    };

    // This is where constraint adjustment would happen.
    // Adjust the point before assigning it
    points[i + 1] = {
      x: points[i].x + updatedLength.x,
      y: points[i].y + updatedLength.y,
      z: points[i].z + updatedLength.z,
    }
  }

  return points;
}

function fabrik(points, goalPos, length = 3, epsilon = 0.05) {
  const { isReachable, maxReach } = targetReachable(points, goalPos)
  if (isReachable) {
    let endEffectorPos = points[points.length - 1];

    while(needToMove(endEffectorPos, goalPos, epsilon)) {
      points = fabrik_finalToRoot(points, goalPos); // Part one
      points = fabrik_rootToFinal(points, goalPos, length); // Part two

      endEffectorPos = points[points.length - 1];
    }
  } else {
    const direction = normalize(goalPos);
    // reach until max in direction of goal
    const reachGoalX = direction.x * (maxReach * 0.99);
    const reachGoalY = direction.y * (maxReach * 0.99);
    const reachGoalZ = direction.z * (maxReach * 0.99);

    reachGoalPos = { x: reachGoalX, y: reachGoalY, z: reachGoalZ };

    return fabrik(points, reachGoalPos);
  }

  return points;
}

// For interpolating between two points.
function moveTowards(currentVal, goalVal, moveSpeed) {
  let newVal = currentVal;
  if (currentVal < goalVal) {
    const distLeft = goalVal - currentVal
    if (distLeft < moveSpeed) {
      newVal = currentVal + distLeft;
    } else {
      newVal = currentVal + moveSpeed;
    }
  }
  if (currentVal > goalVal) {
    const distLeft = currentVal - goalVal
    if (distLeft < moveSpeed) {
      newVal = currentVal - distLeft;
    } else {
      newVal = currentVal - moveSpeed;
    }
  }
  if (currentVal == goalVal) {
    return { reached: true, newVal };
  }
  return { reached: false, newVal };
}
