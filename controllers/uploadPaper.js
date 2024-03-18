const pool = require("../config/db");

const uploadPaperDetails = async (req, res) => {
  // Assuming req.user is properly set and contains the user ID
  const user_id = req.user;
  const { title, abstract, author_count, keywords, paper_domain, authors } =
    req.body;
  try {
    const registrationInsertResult = await pool.query(
      `INSERT INTO PAPER_REGISTER (fk_user_id, title_main, abstract, no_of_authors, status, current_version, paper_domain, keywords)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING registration_id`,
      [
        user_id,
        title,
        abstract,
        author_count,
        "submitted",
        1,
        paper_domain,
        keywords,
      ]
    );

    const registrationId = registrationInsertResult.rows[0].registration_id;

    // Assuming authors is an array of author objects
    for (const author of authors) {
      const { fname, lname, email, country, organization, position } = author;
      const authorInsertResult = await pool.query(
        `INSERT INTO author (fname, lname, email, country, organization, fk_registration_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING author_id`,
        [fname, lname, email, country, organization, registrationId]
      );

      const authorId = authorInsertResult.rows[0].author_id;

      await pool.query(
        `INSERT INTO author_position (fk_author_id, position, fk_registration_id) VALUES ($1, $2, $3)`,
        [authorId, position, registrationId]
      );
    }

    res
      .status(200)
      .json({
        message: "Paper details submitted successfully.",
        registrationId: registrationId,
      });
  } catch (error) {
    console.error("Error while uploading paper details:", error);
    // Send an error response back to the client
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadFilePathToVersionTable = async (req, res) => {
  if(!req.file){
    return res.status(400).json({ error: "No file uploaded" });
  }

  const user_id = req.user;
  const { registrationId, title, paperpath } = req.body;
  try {
    const registrationCheck = await pool.query(
      `select * from paper_register where registration_id = $1 and fk_user_id = $2`,[registrationId, user_id]
    );
    if(registrationCheck.rowCount < 1){
      return res.status(400).json({ error: "Invalid registration id " });
    }

    await pool.query(
      `INSERT INTO VERSION (fk_registration_id, title, paper_url, comments) VALUES ($1, $2, $3, $4)`,
      [registrationId, title, paperpath, "Initial Submission"]
    );
    // Send response back to the client
    res.status(200).json({ message: "File uploaded successfully." });
  } catch (error) {
    console.error("Error while uploading file path to version table:", error);
    // Send an error response back to the client
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadPaperDetails, uploadFilePathToVersionTable };
