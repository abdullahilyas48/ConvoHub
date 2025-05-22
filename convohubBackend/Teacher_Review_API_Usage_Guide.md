
# Course and Teacher API Usage Guide

This document outlines how to use the `Course` and `Teacher` APIs for managing course and teacher data.

---

## **Course API**

### **1. Get All Courses**

#### **Endpoint**
```
GET /review/courses/
```

#### **Description**
Retrieve a list of all courses.

#### **Response**
| Field      | Type   | Description                           |
|------------|--------|---------------------------------------|
| `id`       | Number | Unique ID of the course              |
| `name`     | String | Name of the course                   |

#### Example Success Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Mathematics"
    },
    {
      "id": 2,
      "name": "Physics"
    }
  ],
  "message": "Course(s) retrieved successfully.",
  "status": 200
}
```

---

### **2. Get a Specific Course**

#### **Endpoint**
```
GET /review/courses/<id>/
```

#### **Description**
Retrieve details of a specific course by its ID.

#### **Response**
| Field      | Type   | Description                           |
|------------|--------|---------------------------------------|
| `id`       | Number | Unique ID of the course              |
| `name`     | String | Name of the course                   |

#### Example Success Response
```json
{
  "data": {
    "id": 1,
    "name": "Mathematics"
  },
  "message": "Course retrieved successfully.",
  "status": 200
}
```

---

### **3. Create a New Course**

#### **Endpoint**
```
POST /review/courses/
```

#### **Description**
Create a new course. **Only accessible by superusers.**

#### **Request Payload**
| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| `name`    | String | Yes      | Name of the new course  |

#### Example Request Body
```json
{
  "name": "Chemistry"
}
```

---

### **4. Update a Course**

#### **Endpoint**
```
PUT /review/courses/<id>/
```

#### **Description**
Update details of an existing course. **Only accessible by superusers.**

---

### **5. Delete a Course**

#### **Endpoint**
```
DELETE /review/courses/<id>/
```

#### **Description**
Delete an existing course by its ID. **Only accessible by superusers.**

---

## **Teacher API**

### **1. Get All Teachers**

#### **Endpoint**
```
GET /review/teachers/
```

#### **Description**
Retrieve a list of all teachers.

#### **Response**
| Field      | Type   | Description                           |
|------------|--------|---------------------------------------|
| `id`       | Number | Unique ID of the teacher             |
| `name`     | String | Name of the teacher                  |
| `courses`  | List   | List of course IDs associated         |

#### Example Success Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "courses": [1, 2]
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "courses": [3]
    }
  ],
  "message": "Teacher(s) retrieved successfully.",
  "status": 200
}
```

---

### **2. Get a Specific Teacher**

#### **Endpoint**
```
GET /review/teachers/<id>/
```

---

### **3. Create a New Teacher**

#### **Endpoint**
```
POST /review/teachers/
```

#### **Description**
Create a new teacher. **Only accessible by superusers.**

#### **Request Payload**
| Parameter   | Type   | Required | Description                               |
|-------------|--------|----------|-------------------------------------------|
| `name`      | String | Yes      | Name of the teacher                      |
| `course_ids`| List   | Yes      | List of course IDs the teacher is linked to |

---

### **4. Update a Teacher**

#### **Endpoint**
```
PUT /review/teachers/<id>/
```

#### **Description**
Update a teacher's information. **Only accessible by superusers.**

---

### **5. Delete a Teacher**

#### **Endpoint**
```
DELETE /review/teachers/<id>/
```

#### **Description**
Delete a teacher. **Only accessible by superusers.**

---


## **Teacher Review API**

### **1. Get Teacher Reviews**

#### **Endpoint**
```
GET /review/teacher-reviews/
```

#### **Description**
Retrieve all reviews for a teacher and course.

#### **Request Parameters**
| Parameter      | Type   | Required | Description                               |
|----------------|--------|----------|-------------------------------------------|
| `teacher_id`   | Number | Yes      | ID of the teacher                        |
| `course_id`    | Number | Yes      | ID of the course                         |

#### Example Success Response
```json
{
  "data": [
    {
      "id": 1,
      "user": 5,
      "teacher": 1,
      "course": 2,
      "teaching_style": 5,
      "marking": 4,
      "additional_remarks": "Great teaching methods."
    }
  ],
  "message": "Teacher reviews retrieved successfully.",
  "status": 200
}
```

---

### **2. Add a Teacher Review**

#### **Endpoint**
```
POST /review/teacher-reviews/
```

#### **Description**
Submit a review for a teacher and course. **Only accessible to authenticated users.**

#### **Request Payload**
| Parameter          | Type    | Required | Description                                 |
|--------------------|---------|----------|---------------------------------------------|
| `teacher_id`       | Number  | Yes      | ID of the teacher                          |
| `course_id`        | Number  | Yes      | ID of the course                           |
| `teaching_style`   | Integer | Yes      | Rating for teaching style (1-5)           |
| `marking`          | Integer | Yes      | Rating for marking (1-5)                  |
| `additional_remarks` | String | No      | Additional comments on the teacher's work |

#### Example Success Response
```json
{
  "data": {
    "id": 10,
    "user": 5,
    "teacher": 1,
    "course": 2,
    "teaching_style": 5,
    "marking": 5,
    "additional_remarks": "Excellent teacher."
  },
  "message": "Review added successfully.",
  "status": 201
}
```

---

### **3. Delete a Teacher Review**

#### **Endpoint**
```
DELETE /review/teacher-reviews/<id>/
```

#### **Description**
Delete a specific teacher review by its ID. **Only accessible to superusers.**

#### Example Success Response
```json
{
  "data": {},
  "message": "Review deleted successfully.",
  "status": 200
}
```

---
