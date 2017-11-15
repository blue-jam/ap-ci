package com.kenkoooo.db

import com.kenkoooo.model.Submission
import scalikejdbc._

/**
  * Data Store of SQL
  *
  * @param url      JDBC url of SQL
  * @param user     username of SQL
  * @param password password of SQL
  * @param driver   driver name to connect to SQL
  */
class SqlDataStore(url: String,
                   user: String,
                   password: String,
                   driver: String = "com.mysql.cj.jdbc.Driver") {
  Class.forName(driver)
  ConnectionPool.singleton(url, user, password)

  private var _submissions: Map[Long, Submission] = Map()

  def submission: Map[Long, Submission] = _submissions

  def reloadSubmissions(): Unit = {
    _submissions = DB
      .readOnly { implicit session =>
        val s = Submission.syntax("s")
        withSQL {
          select.from(Submission as s)
        }.map(Submission(s))
          .list()
          .apply()
          .map { submission =>
            submission.id -> submission
          }
          .toMap
      }
  }

  def insertSubmission(submission: Submission): Unit = {
    DB.localTx { implicit session =>
      sql"""INSERT INTO submissions
             (id, epoch_second, problem_id, user_id, language, point, length, result, execution_time)
             VALUES (${submission.id}, ${submission.epochSecond}, ${submission.problemId}, ${submission.user}, ${submission.language}, ${submission.point}, ${submission.length}, ${submission.result}, ${submission.executionTime})"""
        .update()
        .apply()
    }
  }
}