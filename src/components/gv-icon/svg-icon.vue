<template>
  <svg aria-hidden="true">
    <use :xlink:href="`#${name}`" fill="currentColor" />
  </svg>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
};
</script>
