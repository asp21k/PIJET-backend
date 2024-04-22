const pool = require("../config/db");

const getPaperDetails = async (req, res) => {
  const { paperId } = req.body;
  const userId = req.user;
  console.log("user id", userId, "paper id", paperId);
  try {
    const query = `SELECT registration_id, title_main, paper_domain, status FROM paper_register where paper_register.fk_user_id = $1 and paper_register.registration_id = $2`;

    const queryData = await pool.query(query, [userId, paperId]);
   
    res.status(200).json({
      error: false,
      message: "Success",
      data: queryData.rows,
      
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal server error!" });
  }
};

module.exports = { getPaperDetails };
