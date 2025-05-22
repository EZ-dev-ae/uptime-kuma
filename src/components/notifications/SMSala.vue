<template>
    <div class="mb-3">
        <label for="smsala-api-token" class="form-label">{{ $t('smsalaApiToken') }}</label>
        <HiddenInput id="smsala-api-token" v-model="$parent.notification.smsalaApiToken" :required="true"></HiddenInput>
    </div>
    <div class="mb-3">
        <label for="smsala-from" class="form-label">{{ $t('smsalaFrom') }}</label>
        <input id="smsala-from" v-model="$parent.notification.smsalaFrom" type="text" class="form-control" required>
    </div>
    <div class="mb-3">
        <label for="smsala-to" class="form-label">{{ $t('smsalaTo') }}</label>
        <input id="smsala-to" v-model="$parent.notification.smsalaTo" type="text" class="form-control" required>
    </div>
    <div class="mb-3">
        <label for="smsala-message-type" class="form-label">{{ $t('SMS Type') }}</label>
        <select id="smsala-message-type" v-model="$parent.notification.smsalaMessageType" class="form-select">
            <option value="1">Promo</option>
            <option value="2">Transactional</option>
            <option value="3">OTP</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="smsala-encoding" class="form-label">{{ $t('Body Encoding') }}</label>
        <select id="smsala-encoding" v-model="$parent.notification.smsalaMessageEncoding" class="form-select">
            <option value="1">Default</option>
            <option value="2">ASCII</option>
            <option value="3">Octet</option>
            <option value="4">Latin-1</option>
        </select>
    </div>
</template>

<script>
import HiddenInput from "../HiddenInput.vue";

export default {
    components: {
        HiddenInput,
    },
};
</script>
