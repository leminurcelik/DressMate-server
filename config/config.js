CREDENTIALS= JSON.parse(JSON.stringify({
  "type": "service_account",
  "project_id": "psychic-etching-297322",
  "private_key_id": "3920258979a33b9a5ebfe3be4513caa49ee598c5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyxlo1S4Ak9l7r\nEYaQBBmM0tDVzH391JqxSIEi30JLPCJhmZfLSKc4iZjFRJS90UIbtS24wdjGtxtM\nYkdRZQW4S73Dvu1Qb0CJKJURZtoVEXVts4lSq/AXouZdzXwJpxOonLKdgoWWILiz\nBGLIMOZkJA/C4MkSk9iq1m0K14RRNCIjZjiq0OeI/L+SF9zfXuYosEARcFJQq1mX\nObGXmEUGSMhrNKqTOky+Gb1GaC+8A+OM4DAlUcN69TcjC1M9tQaN3Ye6b4+TgczJ\nkya169HD61gNRBS5pIouzRh6FyOcEKStKVBwtfE+3CrUZJTS++yZND253KNHcvTZ\nLMHFOQJvAgMBAAECggEAHcQpAPaxP3ZGF52zagdEuc3gN7j0wW7E0v/fgI7r2tsI\nXnfUbmSKcz910GK64WAWQcbI9hpQncWfJfi3JzZK3YS+8/i2Ss47UJsRNvSJGzjs\n9HcQRlOahlT5RmUQYgsPmuN8Wf2BgJ2yIxx31h1OPx5CAZCr6gvz534MaeG4hkyA\nBWC0AdUyHgcriK7trc/u6SUWyUnJMhbRywk1JdNRLcBghXl3idCpoV3KeRDX2AgX\nrTZiMzKPWoGTQ19U5+IkDgyn0XgEpzS3mMWqP4WqfVguVG+eBzUZNe2Lw5EUL3Ql\nZ+/eOsHocWR74QxFbAlxUwlsKLNKD3l9m8O0ke9cAQKBgQD0LJ1LNAMjq8G+RfdU\nu7PqIhM6icVSlER/MMBd7Ep4g1deK9n51tGwdOikRi+YiAAk3SyT7rPTSsuNZI1c\nilya4LVe8LZ2fGzFNCgO8MRM6rer5fmI6dVckPOfCsCIJdXc6EUIc6yCb0WIVZit\ntIoDRFXxcfE3CVAkETZzmq2iUQKBgQC7buKbkx2gIPQ2Oj1JJ3pDggPfp++h/bcX\nKohWUcSgMXO1LvqqpzIZ/HFiCVb5V0zyvOKLePH14zDY7JnsBWKmmr9LXZ8N2O1E\n08sdp4CfDbDFYeWDxNmtu7hnBA66+un2aA1tRpsAABUygZu0P+EU9OXS/Nv30HIW\nGcLfTPxovwKBgA153OCGqVmxpAq9T840YdSdNtR3QBWzqygd57AHV4DZNtwyrWAV\nlBMaELDoUr4nW2KtdkVf2jriGOPf1dFyrXO6zSfFPzzA1zv3CfLxJNRd6+8nzSLa\nTPVD5r4zWLbq56e+hfjWcYHtZDgHCVsk6K0Pe3LM6BQyhmLHNGsi8UxRAoGAKOCd\nEVr7ahHl0PHQreSrOI/hcmS40XZ4+Ndw1oqMvHcsigZN6uv99EbnH39z9XtBr+rb\n6ZkeBAdhft3TD/N4uWckczZe2vFFhe4+7R+74HRm6hVYre0/oDFBnU34PHU+k1vM\nGdn9MfnSpao4oA4Sc7SZbvNwsdJHH2TM6FBs+BcCgYA/lydy7ZmKRgocPsD+u8vI\nbWj3dUKp/cHhjXVUyl6y5fYOAH3rIEnLfdQKwF7BGtPubZmLcERIj3fBmTzDbRRM\n9G2jUcds110FaVVyJrwmCm57rQBftMSrKRYTxL1DdbV4F0uLPS3Igx3BbYXbHLCC\nYl+ga7LxAPJk1iYd4boEPQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "dressmate@psychic-etching-297322.iam.gserviceaccount.com",
  "client_id": "107241748229551791780",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dressmate%40psychic-etching-297322.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}));
  
const CONFIG_VISION = {
      credentials: {
          private_key: CREDENTIALS.private_key,
          client_email: CREDENTIALS.client_email
      }
  };

  module.exports = { CONFIG_VISION, openWeatherApiKey };


  const openWeatherApiKey = "9d0eba47feca5e6f2c0b625262cce319";