
const getImageReq = (img) => {
  const PAT = "57643cc08f004cc1902541cb9266b860";
  const USER_ID = "maxim";
  const APP_ID = "face-reco";
  const IMAGE_URL = img;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

export const handleImage = async (req, res, db) => {
  try {
    const { id } = req.body;
    const response = await db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries");
    res.json(response);
  } catch {
    res.status(400).json("failed to update image");
  }
};

export const fetchImage = (req, res) => {
  const { input } = req.body;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  fetch(
    `https://api.clarifai.com/v2/models/face-detection/outputs`,
    getImageReq(input)
  )
    .then((response) => response.json())
    .then((result) => { res.json(result)
    }).catch(err => {
        res.status(500).json('bad request')
    })
};
