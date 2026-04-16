import { useFormik } from "formik";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  OutlinedInput,
  MenuItem,
  Select,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton,
} from "@mui/material";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { COLORS } from "@/theme";
import {
  addFriendSchema,
  addFriendInitialValues,
  type AddFriendValues,
} from "@/logic/friend";

interface Props {
  open: boolean;
  onClose: () => void;
}

function validate(values: AddFriendValues) {
  const result = addFriendSchema.safeParse(values);
  if (result.success) return {};
  return result.error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path[0] as string;
    if (!acc[key]) acc[key] = issue.message;
    return acc;
  }, {});
}

export default function AddFriendModal({ open, onClose }: Props) {
  const formik = useFormik<AddFriendValues>({
    initialValues: addFriendInitialValues,
    validate,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      const res = await fetch("/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          relation: values.relation,
          gender: values.gender,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        helpers.setStatus({ serverError: data.error ?? "Something went wrong" });
        helpers.setSubmitting(false);
        return;
      }

      helpers.resetForm();
      onClose();
    },
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  const LABEL_SX = {
    fontSize: "0.6875rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: COLORS.onSurfaceVariant,
    mb: 0.75,
    display: "block",
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: COLORS.surfaceContainerLowest,
          boxShadow: "0 24px 64px -8px rgba(22, 29, 25, 0.12)",
        },
      }}
    >
      <DialogContent sx={{ p: 3.5, pt: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.125rem",
              color: COLORS.onSurface,
              letterSpacing: "-0.02em",
            }}
          >
            Add New Friend
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: COLORS.onSurfaceVariant,
              bgcolor: COLORS.surfaceContainerLow,
              "&:hover": { bgcolor: COLORS.surfaceContainer },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Avatar upload */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3.5 }}>
            <Box
              component="label"
              htmlFor="add-friend-photo"
              sx={{
                width: 88,
                height: 88,
                borderRadius: "20px",
                bgcolor: COLORS.surfaceContainerHigh,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                cursor: "pointer",
                transition: "background-color 0.15s",
                "&:hover": { bgcolor: COLORS.surfaceContainerHighest },
              }}
            >
              {formik.values.photo ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(formik.values.photo)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "20px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <AddAPhotoRoundedIcon
                    sx={{ color: COLORS.onSurfaceVariant, fontSize: 22 }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: COLORS.onSurfaceVariant,
                    }}
                  >
                    Photo
                  </Typography>
                </>
              )}
            </Box>
            <input
              id="add-friend-photo"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                formik.setFieldValue("photo", file ?? undefined);
              }}
            />
          </Box>

          {/* Name */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={LABEL_SX}>Name</Typography>
            <OutlinedInput
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter friend's name"
              fullWidth
              error={formik.touched.name && Boolean(formik.errors.name)}
              sx={{ height: 48, fontSize: "0.9375rem" }}
            />
            {formik.touched.name && formik.errors.name && (
              <FormHelperText error sx={{ mx: 0, mt: 0.5 }}>
                {formik.errors.name}
              </FormHelperText>
            )}
          </Box>

          {/* Relation */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={LABEL_SX}>Relation</Typography>
            <Select
              id="relation"
              name="relation"
              value={formik.values.relation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              error={formik.touched.relation && Boolean(formik.errors.relation)}
              sx={{
                height: 48,
                fontSize: "0.9375rem",
                bgcolor: COLORS.surfaceContainerLow,
                "& fieldset": { border: "none" },
                borderRadius: "8px",
              }}
            >
              {(["Friend", "Family", "Work", "Other"] as const).map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.relation && formik.errors.relation && (
              <FormHelperText error sx={{ mx: 0, mt: 0.5 }}>
                {formik.errors.relation}
              </FormHelperText>
            )}
          </Box>

          {/* Gender */}
          <Box sx={{ mb: 3.5 }}>
            <FormControl
              component="fieldset"
              fullWidth
              error={formik.touched.gender && Boolean(formik.errors.gender)}
            >
              <FormLabel
                component="legend"
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: `${COLORS.onSurfaceVariant} !important`,
                  mb: 1,
                }}
              >
                Gender
              </FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                sx={{ gap: 1 }}
              >
                {(["Male", "Female", "Other"] as const).map((g) => (
                  <Box
                    key={g}
                    onClick={() => formik.setFieldValue("gender", g)}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 1.25,
                      borderRadius: 2,
                      bgcolor:
                        formik.values.gender === g
                          ? `${COLORS.primaryContainer}22`
                          : COLORS.surfaceContainerLow,
                      border: `1.5px solid ${formik.values.gender === g ? COLORS.primary : "transparent"}`,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <FormControlLabel
                      value={g}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            p: 0,
                            color: COLORS.onSurfaceVariant,
                            "&.Mui-checked": { color: COLORS.primary },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color:
                              formik.values.gender === g
                                ? COLORS.primary
                                : COLORS.onSurface,
                          }}
                        >
                          {g}
                        </Typography>
                      }
                      sx={{ m: 0, gap: 0.75 }}
                    />
                  </Box>
                ))}
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <FormHelperText>{formik.errors.gender}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Server error */}
          {formik.status?.serverError && (
            <FormHelperText error sx={{ mx: 0, mb: 2 }}>
              {formik.status.serverError}
            </FormHelperText>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              type="button"
              onClick={handleClose}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                bgcolor: COLORS.surfaceContainerHigh,
                color: COLORS.onSurface,
                "&:hover": { bgcolor: COLORS.surfaceContainerHighest },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              Add Friend
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
