import Vue from 'vue'
import Router from 'vue-router'


import login from '../view/login/index.vue'
import add_student from '../view/management/student/addStudent'
import root_index from '../view/RootUser'
import show_all_student from '../view/management/student/showAllStudent'
import a_and_m_management from '../view/management/AandMmanagement'
import major_management from '../view/management/majorManagement'
import class_management from '../view/management/classManagement'
import subject_management from '../view/management/SubjectManagement'
import set_class_subject_teacher from '../view/management/teacher/setClassSubjectTeacher'
import show_all_teacher from '../view/management/teacher/showAllTeacher'
import add_teacher from '../view/management/teacher/addTeacher'


import teacher_login from '../view/teacher/teacherLogin'
import teacher_management from '../view/teacher/teacherManagement'
import show_class_and_teacher from '../view/teacher/showClassAndTeacher'
import insert_score_by_teacher from '../view/teacher/insertScoreByTeacher'
import show_class_grade_info from '../view/teacher/showClassGradeInfo'


import student_login from '../view/student/login'
import student_grade from '../view/student/index'
import  student_info from '../view/student/studentInfo'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/teacher_login',
      name: 'teacher_login',
      component: teacher_login,
    },
    {
      path: '/student_login',
      name: 'student_login',
      component: student_login,
    },
    {
      path: '/student_grade',
      name: 'student_grade',
      component: student_grade,
      children: [{
        path: '/student_info',
        name: 'student_info',
        component: student_info,
      }
      ]

    },
    {
      path: '/teacher_management',
      name: 'teacher_management',
      component: teacher_management,
      children: [
        {
          path: '/show_class_and_teacher',
          name: 'show_class_and_teacher',
          component: show_class_and_teacher,
        },
        {
          path: '/insert_score_by_teacher',
          name: 'insert_score_by_teacher',
          component: insert_score_by_teacher,
        },

        {
          path: '/show_class_grade_info',
          name: 'show_class_grade_info',
          component: show_class_grade_info,
        },

      ],
    },
    {

      path: '/root_index',
      name: 'root_index',
      component: root_index,
      children: [
        {
          path: '/add_student',
          name: 'add_student',
          component: add_student,
        },
        {
          path: '/show_all_student',
          name: 'show_all_student',
          component: show_all_student,
        },
        {
          path: '/a_and_m_management',
          name: 'a_and_m_management',
          component: a_and_m_management,
        },
        {
          path: '/major_management',
          name: 'major_management',
          component: major_management,
        },
        {
          path: '/class_management',
          name: 'class_management',
          component: class_management,
        },
        {
          path: '/subject_management',
          name: 'subject_management',
          component: subject_management,
        },
        {
          path: '/set_class_subject_teacher',
          name: 'set_class_subject_teacher',
          component: set_class_subject_teacher,
        },
        {
          path: '/add_teacher',
          name: 'add_teacher',
          component: add_teacher,
        },
        {
          path: '/show_all_teacher',
          name: 'show_all_teacher',
          component: show_all_teacher,
        },
      ]
    },

  ]
})
